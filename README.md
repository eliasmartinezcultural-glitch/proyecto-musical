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
- Rango de −12 a +12 semitonos, botones de ajuste rápido y referencia de tonalidad.
- La tonalidad escrita se refleja en la vista previa de acordes.
- La extensión experimental de Chrome puede capturar y procesar el audio de la pestaña activa para aplicar el cambio al sonido de YouTube. Requiere Chrome 116+, instalación manual y activación desde el icono de la extensión.
- El procesador actual es un prototipo granular; no está certificado como herramienta de calidad de estudio y necesita pruebas auditivas reales.

### 3. Letra y acordes
- Editor de letra y acordes por canción. Se pueden escribir acordes entre corchetes, por ejemplo `[C]`, `[G]`, `[Am]`.
- Inserción rápida de etiquetas de intro, estrofa, estribillo, puente y final.
- Vista previa de acordes transpuestos.
- Notas separadas para voz, teclado, guitarra y estructura.
- Guardado automático local y botón de guardado explícito.
- Exportación e importación de respaldo JSON para pasar las fichas a otro dispositivo.

## Límites y transparencia

- La API oficial de YouTube no permite a una página web acceder directamente al audio del reproductor para procesarlo. Por eso el cambio de tono del audio se realiza mediante la extensión de Chrome, no desde JavaScript de la página por sí solo.
- La extensión usa `chrome.tabCapture`, un documento offscreen y AudioWorklet. Chrome requiere un gesto explícito del usuario para iniciar la captura. Mientras captura, el audio original se redirige por el motor para volver a salir procesado. Documentación: [tabCapture](https://developer.chrome.com/docs/extensions/reference/api/tabCapture), [offscreen](https://developer.chrome.com/docs/extensions/reference/api/offscreen).
- El cambio de tono todavía es experimental y puede producir artefactos. Debe probarse en el Chrome real del equipo antes de usarlo en ensayos importantes.
- La extensión funciona en Chrome de escritorio, no en Android ni iPhone.
- Algunos videos no permiten reproducción insertada; algunas velocidades no están disponibles en todos los videos.
- No se descargan, extraen, alojan ni re-almacenan canciones.

## Repertorio y verificación

El catálogo está en [repertorio-30.json](./repertorio-30.json). Los enlaces precargados son referencias de trabajo: comprobar que artista, versión y fragmento coincidan antes de ensayar. Para **Omega — “Bum, bum, bum”**, que queda seleccionada al abrir la Sala, todavía falta conectar una versión de YouTube que la banda confirme. No se inventa una pista ni una tonalidad.

## Datos y privacidad

- Letras, notas, tono elegido y enlaces se guardan en el almacenamiento local del navegador.
- No hay cuentas ni sincronización automática en vivo entre los tres músicos.
- El respaldo JSON permite mover las fichas manualmente; no incluye el audio.
- El audio se transmite desde YouTube y no se guarda en el repositorio.

## Publicación

En GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**.

URL prevista: https://eliasmartinezcultural-glitch.github.io/proyecto-musical/

Después de publicar, probar en Chrome de escritorio: reproducción insertada, selección de canciones, repetición A–B, velocidades, guardado y restauración de fichas, instalación de la extensión y calidad del audio transpuesto. Si una versión anterior sigue apareciendo, recargar la página; el service worker ahora utiliza caché `sala-ensayo-v8`.

## Criterio de diseño

Primero el oído, lo visual y lo práctico. Lenguaje cotidiano, botones grandes, navegación móvil y trabajo compartido de voz, teclado y guitarra sin exigir lectura musical.
