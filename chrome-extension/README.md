# Ocarina · Transpositor de Sala (prototipo experimental)

Esta extensión complementa la página de Sala de Ensayo. El video de YouTube permanece incrustado en la Sala y el usuario controla los semitonos desde el panel **Cambiar el tono**.

## Instalar en Chrome de escritorio

1. Descargar el repositorio completo como ZIP desde GitHub y descomprimirlo.
2. Abrir `chrome://extensions`.
3. Activar **Modo de desarrollador**.
4. Elegir **Cargar descomprimida** y seleccionar la carpeta `chrome-extension`.
5. Abrir la Sala publicada con HTTPS y reproducir una canción.
6. Hacer clic en el icono de Ocarina en la barra de extensiones.
7. Volver a los controles de tono de la Sala. El control de semitonos envía el valor al motor de audio.

Para detenerlo, volver a pulsar el icono de la extensión o usar **Detener motor** dentro de la Sala.

## Arquitectura

- Manifest V3, Chrome 116 o posterior.
- `chrome.tabCapture` obtiene el audio de la pestaña activa tras el gesto del usuario.
- `chrome.offscreen` aloja un documento de audio sin abrir otra ventana.
- AudioWorklet procesa el flujo en tiempo real.
- La página y la extensión intercambian estado y semitonos mediante mensajes.

## Límites conocidos

- El procesador es un prototipo granular básico; no tiene calidad de estudio y puede generar artefactos.
- No se ha probado todavía en una sesión real de Chrome. Debe validarse con distintos videos, auriculares, altavoces, pausas y cambios de canción.
- El audio de la pestaña deja de salir directamente mientras se captura; el motor lo vuelve a emitir procesado.
- No descarga, graba, extrae ni almacena el archivo de YouTube.
- Es solo para Chrome de escritorio. No funciona como extensión de Android o iPhone.
- La API de captura exige que el usuario active la extensión desde su icono; una página web sola no puede iniciar esta captura.

**Estado:** prototipo técnico 0.2.0. No presentarlo como transpositor de producción hasta probar y mejorar la calidad auditiva.
