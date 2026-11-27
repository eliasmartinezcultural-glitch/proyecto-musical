# Elías Martínez · Cuarteto — Sala de ensayo

Sala web mobile-first para ensayar cuarteto de oído, sin partituras. Mantiene tres espacios: **escuchar**, **cambiar el tono** y **letra/acordes**.

## Funciones

### Escuchar
- Catálogo dinámico de 31 canciones.
- Reproductor de YouTube incrustado dentro de la Sala.
- Enlaces de video guardados localmente por canción.
- Reproducir/pausar, anterior/siguiente, saltos de 10 segundos, posición, volumen y velocidades que YouTube admita.
- Marcadores A–B para repetir fragmentos.

### Cambiar el tono
- Rango de -12 a +12 semitonos.
- Motor **Signalsmith Stretch** (WASM + AudioWorklet) incorporado localmente en la extensión Chrome.
- Captura del audio de la pestaña activa, procesamiento local y salida por el dispositivo de audio.
- El tono y el tempo son controles independientes.
- Compensación de latencia cacheada para cambios sucesivos.
- Dos modos: calidad estándar y ahorro de CPU.
- Compensación de formantes opcional, desactivada por defecto porque afecta la mezcla completa, no solo la voz.
- La extensión se limita a capturar la pestaña de la Sala y limpia el motor cuando termina la pista capturada.

### Letra y acordes
- Letra y acordes por canción; acordes entre corchetes, por ejemplo `[C]`, `[G]`, `[Am]`.
- Etiquetas rápidas para intro, estrofa, estribillo, puente y final.
- Vista previa de acordes transpuestos.
- Notas para voz, teclado, guitarra y estructura.
- Guardado local y respaldo JSON.

## Instalar el motor

1. Descargar el repositorio como ZIP y descomprimirlo.
2. Abrir `chrome://extensions`, activar Modo de desarrollador y elegir Cargar descomprimida.
3. Seleccionar la carpeta `chrome-extension`.
4. Abrir la Sala publicada, reproducir una canción y hacer clic en el icono de Ocarina.
5. Esperar **Signalsmith listo** y cambiar semitonos desde la Sala.

Guía completa: [chrome-extension/README.md](./chrome-extension/README.md).

## Motor y licencias

Se incorpora [Signalsmith Stretch Web Audio](https://github.com/Signalsmith-Audio/signalsmith-stretch), con WASM y AudioWorklet, bajo licencia MIT. La licencia está incluida en `chrome-extension/vendor/LICENSE-SignalsmithStretch.txt`.

Se investigaron alternativas como Rubber Band WASM y SoundTouchJS. Rubber Band WASM se distribuye bajo GPL, con implicancias de licencia para redistribución; no se incorpora en esta versión. Signalsmith se mantiene como motor principal por su distribución Web Audio oficial, API para audio en vivo y licencia MIT.

## Límites

- La extensión requiere Chrome de escritorio 116+ y activación explícita desde su icono.
- No funciona como extensión en Android/iPhone.
- La compensación de formantes puede alterar instrumentos en una mezcla polifónica; está apagada por defecto.
- El modo ahorro de CPU usa el preset oficial `cheaper`; no garantiza menor latencia.
- La calidad de audio, latencia percibida y estabilidad deben validarse en el equipo real.
- YouTube puede impedir reproducción insertada de algunos videos.
- No se descargan ni alojan pistas.
- Letras, notas, tono y fuentes se guardan localmente. No hay sincronización en vivo entre músicos; el respaldo JSON es manual.

## Repertorio

El catálogo está en [repertorio-30.json](./repertorio-30.json). Las referencias precargadas deben cotejarse con las versiones elegidas por la banda. Para **Omega — “Bum, bum, bum”**, todavía falta conectar una versión de YouTube que ustedes confirmen.

## Publicación

En GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**.

URL prevista: https://eliasmartinezcultural-glitch.github.io/proyecto-musical/

Después de publicar, comprobar en Chrome: reproducción, A–B, velocidad, cambio de tono, cambio de preset, formantes, detención, restauración de fichas y calidad sonora.

## Criterio de diseño

Primero el oído, lo visual y lo práctico. Lenguaje cotidiano, botones grandes, navegación móvil y trabajo conjunto de voz, teclado y guitarra sin exigir lectura musical.
