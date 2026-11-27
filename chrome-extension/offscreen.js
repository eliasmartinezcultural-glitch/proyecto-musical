import SignalsmithStretch from './vendor/SignalsmithStretch.mjs';
import { normalizeSemitones, normalizeQualityPreset, schedulePitch } from './pitch-control.js';

let context = null;
let stream = null;
let source = null;
let engine = null;
let generation = 0;
let latestPitch = 0;
let preserveFormants = false;
let engineLatency = 0;
let qualityPreset = 'default';

async function stop() {
  generation += 1;
  const oldEngine = engine;
  const oldSource = source;
  const oldStream = stream;
  const oldContext = context;
  engine = null;
  source = null;
  stream = null;
  context = null;
  engineLatency = 0;
  try { await oldEngine?.stop?.(); } catch (error) {}
  try { oldSource?.disconnect(); oldEngine?.disconnect(); } catch (error) {}
  oldStream?.getTracks?.().forEach(track => track.stop());
  if (oldContext && oldContext.state !== 'closed') {
    try { await oldContext.close(); } catch (error) {}
  }
}

async function start(streamId, requestedPreset = qualityPreset) {
  await stop();
  const token = generation;
  try {
    const capturedStream = await navigator.mediaDevices.getUserMedia({
      audio: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: streamId } },
      video: false
    });
    if (!capturedStream.getAudioTracks().length) {
      capturedStream.getTracks().forEach(track => track.stop());
      throw new Error('Chrome no entregó una pista de audio para procesar.');
    }
    if (token !== generation) {
      capturedStream.getTracks().forEach(track => track.stop());
      return;
    }
    stream = capturedStream;
    const capturedAudioStream = capturedStream;
    capturedStream.getAudioTracks().forEach(track => {
      track.addEventListener('ended', () => {
        if (stream !== capturedAudioStream) return;
        stop().then(() => chrome.runtime.sendMessage({
          target: 'background',
          type: 'ENGINE_STOPPED',
          message: 'Chrome detuvo la captura de audio.'
        }));
      }, { once: true });
    });
    context = new AudioContext({ latencyHint: 'interactive' });
    await context.resume();
    if (context.state !== 'running') throw new Error('El navegador no permitió iniciar el motor de audio.');
    if (token !== generation) return;

    SignalsmithStretch.moduleUrl = chrome.runtime.getURL('vendor/SignalsmithStretch.mjs');
    const createdEngine = await SignalsmithStretch(context, {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [2],
      channelCount: 2,
      channelCountMode: 'explicit',
      channelInterpretation: 'speakers'
    });
    if (token !== generation) {
      try { createdEngine.disconnect(); } catch (error) {}
      return;
    }
    engine = createdEngine;
    qualityPreset = normalizeQualityPreset(requestedPreset);
    engine.configure({ preset: qualityPreset });
    source = context.createMediaStreamSource(stream);
    source.connect(engine);
    engine.connect(context.destination);
    await engine.start();
    if (token !== generation) return;
    engineLatency = engine.latency();
    await schedulePitch(engine, latestPitch, context, preserveFormants, engineLatency);
    if (token !== generation) return;
    const latencySeconds = engineLatency;
    chrome.runtime.sendMessage({
      target: 'background',
      type: 'ENGINE_READY',
      message: `Signalsmith listo · ${Math.round(latencySeconds * 1000)} ms · ${qualityPreset === 'cheaper' ? 'ahorro de CPU' : 'calidad estándar'}`
    });
  } catch (error) {
    const cancelled = token !== generation;
    if (!cancelled) await stop();
    if (!cancelled) {
      chrome.runtime.sendMessage({
        target: 'background',
        type: 'ENGINE_ERROR',
        message: error?.message || 'No se pudo iniciar el motor de audio.'
      });
    }
  }
}

function updatePitch(value, keepFormants) {
  latestPitch = normalizeSemitones(value);
  if (typeof keepFormants === 'boolean') preserveFormants = keepFormants;
  if (!engine || !context) return;
  const currentEngine = engine;
  schedulePitch(currentEngine, latestPitch, context, preserveFormants, engineLatency).catch(error => {
    if (engine === currentEngine) {
      chrome.runtime.sendMessage({ target: 'background', type: 'ENGINE_ERROR', message: error?.message || 'Falló el cambio de tono.' });
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.target !== 'offscreen') return;
  if (message.type === 'PING') {
    sendResponse({ ready: true });
    return;
  }
  if (message.type === 'START_CAPTURE') start(message.streamId, message.qualityPreset);
  if (message.type === 'SET_PITCH') updatePitch(message.semitones, message.preserveFormants);
  if (message.type === 'STOP_CAPTURE') stop();
});
