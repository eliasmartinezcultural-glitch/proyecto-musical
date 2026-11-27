# Elías Martínez · Cuarteto — Sala de ensayo

Sala web mobile-first para ensayar cuarteto de oído, sin partituras. Mantiene tres espacios principales: **escuchar**, **cambiar el tono** y **letra/acordes**.

## Funciones integradas

### 1. Escuchar
- Catálogo dinámico de 31 canciones cargado desde `repertorio-30.json`, con buscador por artista o título.
- Reproductor oficial de YouTube incrustado en la misma página.
- Enlaces de video por canción guardados localmente; el grupo puede reemplazar la referencia por su versión preferida.
- Reproducir/pausar, anterior/siguiente, saltos de 10 segundos, barra de posición, volumen y velocidades que YouTube admita para cada video.
- Marcadores A–B para repetir un fragmento.
- Ficha con tono, BPM, estado de verificación y sugerencias separadas para voz, teclado y guitarra.

### 2. Cambiar el tono
- Rango de -12 a +12 semitonos, botones de ajuste rápido y referencia de tonalidad.
- Motor real-time **Signalsmith Stretch** (WASM + AudioWorklet) incorporado localmente en la extensión Chrome.
- Captura el audio de la pestaña activa y lo procesa localmente; el reproductor de YouTube sigue dentro de la Sala.
- El tono y la velocidad son controles separados: cambiar semitonos no cambia el tempo.
- Opción experimental de compensación de formantes para cuidar el timbre de la voz; puede alterar algunos instrumentos en una mezcla completa.
- La extensión informa el estado del motor y la latencia estimada.

### 3. Letra y acordes
- Editor de letra y acordes por canción. Se pueden escribir acordes entre corchetes, por ejemplo `[C]`, `[G]`, `[Am]`.
- Inserción rápida de etiquetas de intro, estrofa, estribillo, puente y final.
- Vista previa de acordes transpuestos.
- Notas separadas para voz, teclado, guitarra y estructura.
- Guardado automático local y botón de guardado explícito.
- Exportación e importación de respaldo JSON para pasar las fichas a otro dispositivo.

## Instalación del motor de audio

La página web sola no puede acceder al audio interno del iframe de YouTube. Por eso el cambio de tono del sonido se realiza mediante la extensión de Chrome:

1. Descargar el repositorio como ZIP desde GitHub y descomprimirlo.
2. Abrir `chrome://extensions`, activar Modo de desarrollador y elegir Cargar descomprimida.
3. Seleccionar la carpeta `chrome-extension`.
4. Abrir la Sala publicada, reproducir una canción y hacer clic en el icono de Ocarina.
5. Esperar el mensaje **Signalsmith listo** y cambiar semitonos desde la Sala.

Guía completa: [chrome-extension/README.md](./chrome-extension/README.md).

## Motor y créditos

Se incorpora la distribución Web Audio de [Signalsmith Stretch](https://github.com/Signalsmith-Audio/signalsmith-stretch), con WASM y AudioWorklet, desde su distribución oficial. La licencia MIT está incluida en `chrome-extension/vendor/LICENSE-SignalsmithStretch.txt`. No se usa CDN para el motor DSP y no se envía audio a servidores.

## Límites y transparencia

- La extensión requiere Chrome de escritorio 116 o posterior y activación explícita desde su icono.
- No funciona como extensión en Android o iPhone.
- La compensación de formantes es experimental en una mezcla polifónica; puede cambiar el timbre de instrumentos.
- La latencia depende del equipo y del navegador.
- La integración de código y los controles tienen pruebas automatizadas. La calidad sonora y la carga efectiva de WASM/AudioWorklet deben validarse escuchando en Chrome real; no se presentan como certificadas.
- Algunos videos no permiten reproducción insertada; algunas velocidades no están disponibles en todos los videos.
- No se descargan, extraen, alojan ni re-almacenan canciones.

## Repertorio y verificación

El catálogo está en [repertorio-30.json](./repertorio-30.json). Los enlaces precargados son referencias de trabajo: comprobar que artista, versión y fragmento coincidan antes de ensayar. Para **Omega — “Bum, bum, bum”**, que queda seleccionada al abrir la Sala, todavía falta conectar una versión de YouTube que la banda confirme. No se inventa una pista ni una tonalidad.

## Datos y privacidad

- Letras, notas, tono elegido, compensación de formantes y enlaces se guardan en el almacenamiento local del navegador.
- No hay cuentas ni sincronización automática en vivo entre los tres músicos.
- El respaldo JSON permite mover las fichas manualmente; no incluye el audio.
- El audio se transmite desde YouTube y se procesa en el navegador.

## Publicación

En GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**.

URL prevista: https://eliasmartinezcultural-glitch.github.io/proyecto-musical/

Después de publicar, probar en Chrome de escritorio: reproducción insertada, selección de canciones, repetición A–B, velocidades, guardado y restauración de fichas, instalación de la extensión y calidad del audio transpuesto. El service worker utiliza caché `sala-ensayo-v9`.

## Criterio de diseño

Primero el oído, lo visual y lo práctico. Lenguaje cotidiano, botones grandes, navegación móvil y trabajo compartido de voz, teclado y guitarra sin exigir lectura musical.
