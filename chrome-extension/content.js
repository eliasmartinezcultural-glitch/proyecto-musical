window.addEventListener('message', event => {
  if (event.source !== window || event.origin !== location.origin || !event.data || event.data.source !== 'ocarina-sala') return;
  const data = event.data;
  if (data.type === 'SET_QUALITY') {
    chrome.runtime.sendMessage({
      type: 'SALA_QUALITY',
      qualityPreset: data.qualityPreset === 'cheaper' ? 'cheaper' : 'default'
    }).catch(() => {});
  }
  if (data.type === 'SET_PITCH') {
    chrome.runtime.sendMessage({
      type: 'SALA_PITCH',
      semitones: data.semitones,
      preserveFormants: data.preserveFormants !== false
    }).catch(() => {});
  }
  if (data.type === 'STOP') chrome.runtime.sendMessage({ type: 'SALA_STOP' }).catch(() => {});
  if (data.type === 'STATUS') {
    chrome.runtime.sendMessage({ type: 'SALA_STATUS' }, result => {
      window.postMessage({
        source: 'ocarina-transpose',
        type: 'STATUS',
        active: !!result?.active,
        message: result?.active ? 'Captura activa. Comprobando el motor de audio…' : 'Motor detenido o sin capturar.'
      }, location.origin);
    });
  }
});

chrome.runtime.onMessage.addListener(message => {
  if (message?.type === 'SALA_CAPTURE_STATUS') {
    window.postMessage({
      source: 'ocarina-transpose',
      type: 'STATUS',
      active: !!message.active,
      message: message.message || ''
    }, location.origin);
  }
});
