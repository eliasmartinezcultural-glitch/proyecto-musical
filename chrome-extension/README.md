# Ocarina · Transpositor de Sala (prototipo)

Extensión experimental de Chrome para procesar el audio de la pestaña donde está abierta la Sala de Ensayo. La idea es que el video de YouTube siga dentro de `tono.html` y los controles de tono permanezcan en esa misma pantalla.

## Instalación de prueba

1. Descargar el repositorio como ZIP y descomprimirlo.
2. Abrir `chrome://extensions` en Chrome.
3. Activar **Modo de desarrollador**.
4. Elegir **Cargar descomprimida** y seleccionar la carpeta `chrome-extension`.
5. Abrir la Sala publicada en GitHub Pages y reproducir un video.
6. Con la pestaña de la Sala activa, hacer clic una vez en el icono de la extensión. Ese gesto autoriza a Chrome a capturar el audio de esa pestaña.
7. Desde ese momento, el control de semitonos de la Sala envía el valor al motor de audio de la extensión. No hace falta abrir YouTube en otra pestaña.

## Qué hace y qué falta probar

- Usa `chrome.tabCapture` para capturar el sonido de la pestaña activa, no para descargarlo.
- Usa un documento offscreen y AudioWorklet para procesar y devolver el sonido a la salida del dispositivo.
- El procesador incluido es un prototipo granular de cambio de tono. Puede producir artefactos; no debe considerarse calidad de estudio.
- El proyecto debe probarse en Chrome real con videos embebidos, altavoces y auriculares, cambios de tono durante reproducción, pausa y cambio de canción.
- La extensión no lee ni extrae el archivo fuente de YouTube. Solo procesa el audio que Chrome reproduce en la pestaña activa.
- El audio original puede dejar de sonar directamente mientras la captura está activa; el offscreen lo devuelve procesado.

**Estado:** código inicial de prototipo, todavía no validado en una instalación real. No presentar como función terminada hasta completar las pruebas.
