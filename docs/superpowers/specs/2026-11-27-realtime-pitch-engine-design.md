# Diseño: motor de cambio de tono en tiempo real

Fecha: 2026-11-27
Estado: autorizado para avanzar sobre la rama `feature/realtime-pitch-engine`.

## Intención
Convertir el cambiador de tono de la Sala de Ensayo en un procesador real de audio en tiempo real. El músico debe poder subir o bajar la tonalidad de una canción mientras suena, sin que cambie el tempo, manteniendo la reproducción dentro de la misma pantalla y con controles simples para una banda que aprende de oído.

## Estado actual
La Sala usa el reproductor incrustado de YouTube. La página no puede leer el audio interno del iframe por las restricciones de origen de YouTube. La extensión MV3 captura el audio de la pestaña con `chrome.tabCapture`, lo redirige a un documento offscreen y hoy lo procesa con un algoritmo granular propio de calidad experimental. Ese algoritmo es la parte que debe reemplazarse.

## Decisión técnica
Usar la versión Web Audio oficial de **Signalsmith Stretch** como motor principal. Su paquete web ofrece WASM + AudioWorklet, acepta entrada de audio en vivo y permite programar cambios de semitonos y compensación de formantes. Incluir los archivos de distribución y la licencia MIT dentro del repositorio, sin CDN ni envío de audio a servidores. Mantener una arquitectura preparada para que SoundTouchJS pueda evaluarse como motor alternativo en una fase posterior, pero no duplicar motores en esta entrega: eso agregaría peso y dos rutas de audio antes de probar una.

## Objetivos
- Procesar audio capturado de la pestaña Chrome en el dispositivo.
- Cambiar de -12 a +12 semitonos en tiempo real, con cambios suaves y sin alterar el tempo.
- Mantener el audio estéreo y el control desde el deslizador de la Sala.
- Informar claramente los estados: extensión ausente, captura solicitada, motor listo, detenido y error.
- Detener y liberar AudioContext, stream, nodos y buffers correctamente.
- Manejar cambios de canción, pausa, reanudación y pérdida de pestaña sin dejar el audio silenciado.
- Cargar el motor desde archivos locales de la extensión; no depender de CDN.
- Mantener la Sala con sus tres espacios principales y no añadir una navegación paralela.
- Documentar instalación manual de extensión en Chrome de escritorio y una prueba auditiva guiada.

## No objetivos
- No prometer instalación automática en el equipo del usuario: Chrome exige instalación y permiso explícitos.
- No extraer ni descargar audio de YouTube.
- No prometer compatibilidad con Android/iPhone ni navegadores que no sean Chrome de escritorio.
- No prometer calidad de estudio sin una prueba auditiva real.
- No implementar sincronización entre músicos ni cuentas.
- No introducir una segunda librería DSP en paralelo en esta entrega.

## Experiencia esperada
1. El usuario abre la Sala y reproduce una canción.
2. Activa la extensión desde el icono de Chrome.
3. La extensión confirma cuando el motor de audio está listo.
4. El usuario mueve el control de semitonos y escucha el cambio sin cambiar el tempo.
5. Al detener el motor, el audio original vuelve a la ruta normal.
6. Si falla el motor, la interfaz explica qué hacer y no muestra estado activo falso.

## Riesgos y controles
- La API de captura requiere un gesto del usuario; conservarlo como paso visible.
- La carga de WASM/AudioWorklet en una extensión MV3 debe probarse con archivos locales y CSP real; no recurrir a CDN como parche silencioso.
- El algoritmo introduce latencia inherente. Informarla y priorizar estabilidad sobre latencia mínima.
- El cambio de formantes en música completa puede alterar timbres de instrumentos; exponer una estrategia prudente y no afirmar que conserva perfectamente todas las voces/instrumentos.
- El comportamiento en YouTube, cambios de video y errores de captura requiere prueba manual en Chrome real.

## Criterios de aceptación
- El control de tono cambia el valor DSP y no se limita a transponer acordes escritos.
- El motor usa WASM/AudioWorklet local y no el procesador granular anterior.
- Los cambios de semitonos se limitan a -12..+12.
- El motor informa listo solo después de construir y arrancar la cadena de audio.
- El cierre detiene tracks y cierra el AudioContext.
- Los tests automatizados verifican el controlador de semitonos y el contrato de mensajes.
- La documentación separa lo verificado automáticamente de lo que aún requiere escuchar en Chrome real.
