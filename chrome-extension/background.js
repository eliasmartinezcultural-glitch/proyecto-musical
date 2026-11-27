let activeTabId = null;
let creating = null;
let qualityPreset = 'default';
let qualitySave = Promise.resolve();
let engineReady = false;
let engineMessage = 'Motor detenido.';

async function ensureOffscreen() {
  const url = chrome.runtime.getURL('offscreen.html');
  const contexts = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'], documentUrls: [url] });
  if (!contexts.length) {
    if (!creating) {
      creating = chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['USER_MEDIA'],
        justification: 'Procesar localmente el audio de la pestaña activa para cambiar el tono en la Sala de Ensayo.'
      });
    }
    try { await creating; } finally { creating = null; }
  }
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await chrome.runtime.sendMessage({ target: 'offscreen', type: 'PING' });
      if (response?.ready) { ready = true; break; }
    } catch (error) {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (!ready) throw new Error('El documento de audio no respondió. Recargá la extensión y volvé a intentar.');
}

async function notifyTab(tabId, active, message = '') {
  if (!tabId) return;
  try { await chrome.tabs.sendMessage(tabId, { type: 'SALA_CAPTURE_STATUS', active, message }); } catch (error) {}
}

async function stopCapture(tabId, message = 'Transposición detenida.') {
  try { await chrome.runtime.sendMessage({ target: 'offscreen', type: 'STOP_CAPTURE' }); } catch (error) {}
  const oldTabId = tabId ?? activeTabId;
  activeTabId = null;
  engineReady = false;
  engineMessage = message;
  await notifyTab(oldTabId, false, message);
}

chrome.action.onClicked.addListener(async tab => {
  if (!tab?.id) return;
  const allowedUrl = 'https://eliasmartinezcultural-glitch.github.io/proyecto-musical/';
  if (!tab.url?.startsWith(allowedUrl)) {
    await chrome.action.setTitle({ tabId: tab.id, title: 'Abrí la Sala de Ensayo para usar el transpositor Ocarina' });
    return;
  }
  try {
    await qualitySave;
    const savedPreferences = await chrome.storage.local.get('qualityPreset');
    qualityPreset = savedPreferences.qualityPreset === 'cheaper' ? 'cheaper' : 'default';
    const captured = await chrome.tabCapture.getCapturedTabs();
    const already = captured.find(item => item.tabId === tab.id && item.status === 'active');
    if (already) {
      await stopCapture(tab.id, 'Motor detenido. El audio vuelve al modo normal.');
      return;
    }
    if (captured.length) await stopCapture(captured[0].tabId, 'Cambiando la pestaña procesada…');
    await ensureOffscreen();
    activeTabId = tab.id;
    engineReady = false;
    engineMessage = 'Iniciando motor de audio Signalsmith…';
    await notifyTab(tab.id, false, engineMessage);
    const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id });
    await chrome.runtime.sendMessage({ target: 'offscreen', type: 'START_CAPTURE', streamId, qualityPreset });
  } catch (error) {
    const message = 'No se pudo activar el motor: ' + (error?.message || 'revisá permisos y compatibilidad de Chrome');
    await notifyTab(tab.id, false, message);
    activeTabId = null;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.target === 'offscreen') return;
  if (message?.target === 'background' && message.type === 'ENGINE_READY') {
    engineReady = true;
    engineMessage = message.message || 'Motor de audio listo. Ajustá los semitonos desde la Sala.';
    notifyTab(activeTabId, true, engineMessage);
    return;
  }
  if (message?.target === 'background' && message.type === 'ENGINE_ERROR') {
    engineReady = false;
    engineMessage = 'No se pudo procesar el audio: ' + (message.message || 'error desconocido');
    const oldTabId = activeTabId;
    stopCapture(oldTabId, 'No se pudo procesar el audio: ' + (message.message || 'error desconocido'));
    return;
  }
  if (message?.target === 'background' && message.type === 'ENGINE_STOPPED') {
    const oldTabId = activeTabId;
    activeTabId = null;
    engineReady = false;
    engineMessage = message.message || 'La captura de audio se detuvo.';
    notifyTab(oldTabId, false, engineMessage);
    return;
  }
  if (message?.type === 'SALA_QUALITY') {
    qualityPreset = message.qualityPreset === 'cheaper' ? 'cheaper' : 'default';
    qualitySave = chrome.storage.local.set({ qualityPreset }).catch(() => {});
    sendResponse({ ok: true, qualityPreset, appliesOnNextStart: true });
    return;
  }
  if (message?.type === 'SALA_PITCH') {
    const semitones = Math.max(-12, Math.min(12, Math.round(Number(message.semitones) || 0)));
    chrome.runtime.sendMessage({
      target: 'offscreen',
      type: 'SET_PITCH',
      semitones,
      preserveFormants: message.preserveFormants !== false
    }).catch(() => {});
    sendResponse({ ok: true, semitones });
    return;
  }
  if (message?.type === 'SALA_STOP') {
    stopCapture(activeTabId ?? sender.tab?.id, 'Motor detenido desde la Sala.');
    sendResponse({ ok: true });
    return;
  }
  if (message?.type === 'SALA_STATUS') {
    Promise.all([
      chrome.tabCapture.getCapturedTabs(),
      chrome.runtime.sendMessage({ target: 'offscreen', type: 'GET_STATUS' }).catch(() => null)
    ]).then(([tabs, audioStatus]) => {
      const captureActive = tabs.some(item => item.tabId === sender.tab?.id && item.status === 'active');
      engineReady = Boolean(captureActive && audioStatus?.active);
      if (engineReady) {
        activeTabId = sender.tab.id;
        engineMessage = `Signalsmith listo · ${audioStatus.latencyMs} ms · ${audioStatus.qualityPreset === 'cheaper' ? 'ahorro de CPU' : 'calidad estándar'}`;
      } else if (!captureActive) {
        engineReady = false;
        activeTabId = null;
      }
      sendResponse({
        active: engineReady,
        captureActive,
        engineReady,
        message: engineReady ? engineMessage : (captureActive ? 'Captura activa; el motor todavía está iniciando.' : engineMessage)
      });
    }).catch(() => sendResponse({ active: false, captureActive: false, engineReady: false, message: 'No se pudo consultar la captura.' }));
    return true;
  }
});

chrome.tabs.onRemoved.addListener(tabId => {
  if (tabId === activeTabId) stopCapture(tabId, 'Pestaña cerrada.');
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  const allowedUrl = 'https://eliasmartinezcultural-glitch.github.io/proyecto-musical/';
  if (tabId === activeTabId && changeInfo.url && !changeInfo.url.startsWith(allowedUrl)) {
    stopCapture(tabId, 'Saliste de la Sala. El motor se detuvo por seguridad.');
  }
});
