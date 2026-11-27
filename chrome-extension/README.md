# Ocarina · Transpositor de Sala 0.3.0

Extensión de Chrome de escritorio para cambiar el tono del audio que se reproduce dentro de la Sala de Ensayo, sin cambiar el tempo.

## Instalar en Chrome

1. Abrí el repositorio: https://github.com/eliasmartinezcultural-glitch/proyecto-musical
2. En GitHub, elegí **Code → Download ZIP** y descomprimí el archivo.
3. Abrí `chrome://extensions` en Chrome.
4. Activá **Modo de desarrollador**.
5. Elegí **Cargar descomprimida** y seleccioná la carpeta `chrome-extension` que está dentro del ZIP.
6. Si ya habías instalado la versión experimental anterior, quitá esa extensión desde `chrome://extensions` para no dejar dos versiones activas.
7. Abrí la Sala publicada en GitHub Pages y reproducí una canción.
8. Hacé clic en el icono de Ocarina en la barra de Chrome. Esperá el mensaje **Signalsmith listo**.
9. Volvé a la Sala y mové el control de semitonos.

Para detener el procesamiento, hacé clic otra vez en el icono de Ocarina o tocá **Detener motor** en la Sala.

## Motor de audio

- **Signalsmith Stretch Web Audio**, compilado a WASM y AudioWorklet, se incluye localmente en `vendor/SignalsmithStretch.mjs`.
- No se descarga ningún motor desde CDN al usar la extensión.
- El audio de la pestaña se captura con `chrome.tabCapture`, se procesa en el documento offscreen y vuelve a salir por el dispositivo de audio.
- El control aplica de -12 a +12 semitonos, con programación compensada por la latencia del motor.
- La opción **Cuidar el timbre de la voz** activa la compensación de formantes. En una mezcla completa puede modificar algunos instrumentos; si el resultado suena extraño, desactivala y compará.
- El motor mantiene el tempo al cambiar semitonos. La velocidad de YouTube sigue siendo un control separado.
- Todo el procesamiento se realiza localmente en Chrome. No se suben ni se guardan pistas.

## Créditos y licencia

El motor Signalsmith Stretch se incorpora desde:
https://github.com/Signalsmith-Audio/signalsmith-stretch

La versión Web se tomó del archivo `web/release/SignalsmithStretch.mjs` (blob upstream `7d5cae72e77a84143ed91ba12fc91b806dc4d9d1`). Su licencia MIT está incluida en `vendor/LICENSE-SignalsmithStretch.txt`.

## Requisitos y límites

- Chrome de escritorio 116 o posterior.
- GitHub Pages debe estar publicado por HTTPS en el dominio configurado en `manifest.json`.
- Chrome exige que el usuario active la captura con un clic en el icono de la extensión.
- La captura puede introducir latencia; el estado muestra la latencia informada por el motor.
- El cambio de formantes en música polifónica es una aproximación: no garantiza que cada voz e instrumento conserve exactamente su timbre.
- La extensión no se instala automáticamente, no funciona como extensión en Android/iPhone y no puede activarse desde una página sin permiso explícito.
- La carga local de WASM/AudioWorklet bajo las reglas de seguridad de MV3 debe comprobarse en Chrome real.

## Prueba auditiva recomendada

Con auriculares y una canción que la banda conozca:

1. Confirmá que la Sala reproduce audio antes de activar el motor.
2. Activá la extensión y esperá **Signalsmith listo**.
3. Probá 0, +1, -1, +2, -2, +5 y -5 semitonos.
4. Compará con **Cuidar el timbre** activado y desactivado.
5. Cambiá la velocidad de YouTube por separado y confirmá que no se confunda con el tono.
6. Pausá y reanudá; cambiá de canción; detené el motor.
7. Confirmá que el audio vuelve al modo normal al detener la extensión.
8. Si hay silencio, cortes o distorsión, detené el motor y anotá qué paso lo provocó.

**Estado honesto:** la integración WASM/AudioWorklet y sus controles están implementados y tienen pruebas automatizadas de lógica. La calidad sonora, la latencia percibida y la carga efectiva de AudioWorklet en tu instalación todavía necesitan la prueba auditiva real en tu Chrome.
