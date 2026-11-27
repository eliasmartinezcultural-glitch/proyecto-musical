# Motor de tono en tiempo real Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Reemplazar el procesador granular experimental por Signalsmith Stretch WASM/AudioWorklet y conectar sus controles a la Sala de Ensayo.

**Architecture:** La extensión Chrome seguirá capturando el audio de la pestaña con `tabCapture`. El documento offscreen cargará la distribución local de Signalsmith Stretch, conectará el stream a su AudioWorklet y recibirá cambios de semitonos desde la página mediante el service worker. Un módulo pequeño y testeable normalizará los valores y definirá el contrato de control.

**Tech Stack:** Chrome Manifest V3, Web Audio API, AudioWorklet, WASM, Signalsmith Stretch (MIT), JavaScript ES modules, Node.js built-in test runner.

**Spec:** `docs/superpowers/specs/2026-11-27-realtime-pitch-engine-design.md`

## Global Constraints
- Chrome de escritorio 116 o posterior.
- No CDN para el motor DSP; cargar los archivos vendorizados localmente.
- Mantener captura explícita mediante clic en el icono de extensión.
- Rango de tono: -12 a +12 semitonos.
- No alterar el tempo al cambiar semitonos.
- Mantener el audio local y no almacenar ni descargar pistas.
- No declarar calidad profesional ni éxito auditivo sin prueba real.

## Review Focus
- Cambio de canción o video durante captura y su impacto en el audio de salida.
- Error al cargar WASM/AudioWorklet bajo CSP de extensiones MV3.
- Pestaña capturada cerrada mientras el motor está activo.
- Audio mono frente a estéreo y cantidad variable de canales.
- Detener la extensión cuando el stream o AudioContext ya está cerrado.

---

### Task 1: Vendor y encapsular Signalsmith Stretch

**Files:**
- Create: `chrome-extension/vendor/SignalsmithStretch.mjs`
- Create: `chrome-extension/vendor/LICENSE-SignalsmithStretch.txt`
- Create: `chrome-extension/pitch-control.js`
- Create: `tests/pitch-control.test.mjs`

**Interfaces:**
- Produces: `normalizeSemitones(value)` returns an integer in [-12, 12].
- Produces: `schedulePitch(engine, value, audioContext)` schedules a smooth semitone update on the Signalsmith node.
- Consumes: the upstream Signalsmith Stretch Web API.

- [ ] Write failing tests for clamping, invalid numeric values, and scheduling.
- [ ] Run `node --test tests/pitch-control.test.mjs`; expected initial failure because module is absent.
- [ ] Add the minimal controller module and run the test again; expected all tests pass.
- [ ] Vendor the official Signalsmith Stretch web distribution and its MIT license; verify the module includes its WASM payload and does not require an external binary/CDN.
- [ ] Run syntax/import checks on the vendored module and controller.
- [ ] Commit: `feat(audio): vendor Signalsmith real-time pitch engine`.

### Task 2: Replace the experimental extension processor

**Files:**
- Modify: `chrome-extension/offscreen.html`
- Modify: `chrome-extension/offscreen.js`
- Modify: `chrome-extension/background.js`
- Modify: `chrome-extension/content.js`
- Remove/replace: `chrome-extension/pitch-worklet.js`

**Interfaces:**
- Consumes: `normalizeSemitones`, `schedulePitch` from Task 1.
- Produces: explicit engine lifecycle messages `ENGINE_READY`, `ENGINE_ERROR`, `CAPTURE_STOPPED`; the page receives active status only after the engine is started.

- [ ] Add tests for the message contract and semitone bounds before changing production handlers.
- [ ] Verify RED with Node's built-in test runner.
- [ ] Load the local Signalsmith module in the offscreen document, configure its AudioWorklet module URL to a local extension URL if required by MV3, and instantiate it against the live tab MediaStream.
- [ ] Start the processor with `start()`; connect capture source → Signalsmith node → destination.
- [ ] Replace custom granular processing with scheduled semitone changes.
- [ ] Make start/stop idempotent and release every stream track, node, and AudioContext.
- [ ] Run all unit tests and syntax checks.
- [ ] Commit: `feat(extension): process captured tab audio with Signalsmith`.

### Task 3: Connect Sala UI and publish installation/test guidance

**Files:**
- Modify: `tono.js`
- Modify: `tono.html`
- Modify: `chrome-extension/manifest.json`
- Modify: `chrome-extension/README.md`
- Modify: `README.md`
- Modify: `sw.js`

**Interfaces:**
- Consumes: extension lifecycle messages from Task 2.
- Produces: visible status and controls for the existing Cambiar el tono section; no new top-level section.

- [ ] Add tests for page-to-extension pitch message payload and UI bounds.
- [ ] Verify RED before implementation.
- [ ] Ensure status distinguishes extension unavailable, starting, ready, stopped, and error.
- [ ] Keep existing YouTube playback controls and chord transposition behavior; make clear that chord preview is not audio processing.
- [ ] Bump service-worker cache key and include all local engine files in extension packaging guidance.
- [ ] Document a manual Chrome test matrix: start/stop, ±1/±2/±5/±12, tempo unchanged, pause/resume, song switch, tab close, and error recovery.
- [ ] Run all tests, JSON parse, JavaScript syntax checks, and repository consistency checks.
- [ ] Commit: `feat(sala): connect real-time pitch engine and document testing`.

## Completion boundary
Automated tests can verify message contracts and state handling. Actual audio quality, latency, tempo preservation, and MV3 AudioWorklet/WASM loading must still be verified in the user's Chrome desktop. The implementation must not claim those as proven before that test.
