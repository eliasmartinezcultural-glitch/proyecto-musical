let activeTabId = null;
let creating = null;

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
  await notifyTab(oldTabId, false, message);
}

chrome.action.onClicked.addListener(async tab => {
  if (!tab?.id) return;
  try {
    const captured = await chrome.tabCapture.getCapturedTabs();
    const already = captured.find(item => item.tabId === tab.id && item.status === 'active');
    if (already) {
      await stopCapture(tab.id, 'Motor detenido. El audio vuelve al modo normal.');
      return;
    }
    if (captured.length) await stopCapture(captured[0].tabId, 'Cambiando la pestaña procesada…');
    await ensureOffscreen();
    activeTabId = tab.id;
    await notifyTab(tab.id, false, 'Iniciando motor de audio Signalsmith…');
    const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id });
    await chrome.runtime.sendMessage({ target: 'offscreen', type: 'START_CAPTURE', streamId });
  } catch (error) {
    const message = 'No se pudo activar el motor: ' + (error?.message || 'revisá permisos y compatibilidad de Chrome');
    await notifyTab(tab.id, false, message);
    activeTabId = null;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.target === 'offscreen') return;
  if (message?.target === 'background' && message.type === 'ENGINE_READY') {
    notifyTab(activeTabId, true, message.message || 'Motor de audio listo. Ajustá los semitonos desde la Sala.');
    return;
  }
  if (message?.target === 'background' && message.type === 'ENGINE_ERROR') {
    const oldTabId = activeTabId;
    activeTabId = null;
    notifyTab(oldTabId, false, 'No se pudo procesar el audio: ' + (message.message || 'error desconocido'));
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
    stopCapture(activeTabId, 'Motor detenido desde la Sala.');
    sendResponse({ ok: true });
    return;
  }
  if (message?.type === 'SALA_STATUS') {
    chrome.tabCapture.getCapturedTabs()
      .then(tabs => sendResponse({ active: tabs.some(item => item.tabId === sender.tab?.id && item.status === 'active') }))
      .catch(() => sendResponse({ active: false }));
    return true;
  }
});

chrome.tabs.onRemoved.addListener(tabId => {
  if (tabId === activeTabId) stopCapture(tabId, 'Pestaña cerrada.');
});
