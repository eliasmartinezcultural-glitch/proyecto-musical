import SignalsmithStretch from './vendor/SignalsmithStretch.mjs';
import { normalizeSemitones, schedulePitch } from './pitch-control.js';

let context = null;
let stream = null;
let source = null;
let engine = null;
let generation = 0;
let latestPitch = 0;
let preserveFormants = true;

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
  try { await oldEngine?.stop?.(); } catch (error) {}
  try { oldSource?.disconnect(); oldEngine?.disconnect(); } catch (error) {}
  oldStream?.getTracks?.().forEach(track => track.stop());
  if (oldContext && oldContext.state !== 'closed') {
    try { await oldContext.close(); } catch (error) {}
  }
}

async function start(streamId) {
  await stop();
  const token = generation;
  try {
    const capturedStream = await navigator.mediaDevices.getUserMedia({
      audio: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: streamId } },
      video: false
    });
    if (token !== generation) {
      capturedStream.getTracks().forEach(track => track.stop());
      return;
    }
    stream = capturedStream;
    context = new AudioContext({ latencyHint: 'interactive' });
    await context.resume();
    if (token !== generation) return;

    SignalsmithStretch.moduleUrl = chrome.runtime.getURL('vendor/SignalsmithStretch.mjs');
    const createdEngine = await SignalsmithStretch(context, {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [2]
    });
    if (token !== generation) {
      try { createdEngine.disconnect(); } catch (error) {}
      return;
    }
    engine = createdEngine;
    source = context.createMediaStreamSource(stream);
    source.connect(engine);
    engine.connect(context.destination);
    await engine.start();
    if (token !== generation) return;
    await schedulePitch(engine, latestPitch, context, preserveFormants);
    chrome.runtime.sendMessage({
      target: 'background',
      type: 'ENGINE_READY',
      message: `Signalsmith listo · ${Math.round(engine.latency() * 1000)} ms de latencia`
    });
  } catch (error) {
    await stop();
    chrome.runtime.sendMessage({
      target: 'background',
      type: 'ENGINE_ERROR',
      message: error?.message || 'No se pudo iniciar el motor de audio.'
    });
  }
}

function updatePitch(value, keepFormants) {
  latestPitch = normalizeSemitones(value);
  if (typeof keepFormants === 'boolean') preserveFormants = keepFormants;
  if (!engine || !context) return;
  schedulePitch(engine, latestPitch, context, preserveFormants).catch(error => {
    chrome.runtime.sendMessage({ target: 'background', type: 'ENGINE_ERROR', message: error?.message || 'Falló el cambio de tono.' });
  });
}

chrome.runtime.onMessage.addListener(message => {
  if (message?.target !== 'offscreen') return;
  if (message.type === 'START_CAPTURE') start(message.streamId);
  if (message.type === 'SET_PITCH') updatePitch(message.semitones, message.preserveFormants);
  if (message.type === 'STOP_CAPTURE') stop();
});
