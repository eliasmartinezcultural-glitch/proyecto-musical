# Elías Martínez · Cuarteto — Sala de ensayo

Sala web mobile-first para ensayar canciones populares de oído, sin partituras y con una navegación de tres funciones: escuchar, cambiar el tono y trabajar letra/acordes.

## Cómo funciona hoy

- Reproductor oficial de YouTube insertado dentro de `tono.html`: la banda permanece en la Sala durante el ensayo.
- Se puede elegir una canción con fuente precargada o pegar un enlace de YouTube y guardarlo por canción en ese dispositivo.
- Controles de reproducción/pausa, salto de 5 segundos, posición, volumen, velocidades que YouTube permita para ese video y repetición de fragmento A–B.
- Ficha local de letra y acordes.
- Transposición de los acordes escritos por semitonos, con tonalidad de referencia y vista previa.
- La Sala no descarga ni aloja canciones. El video sigue siendo servido por YouTube.

## Límite técnico que no se oculta

La API oficial de YouTube no entrega el audio del reproductor a la página para procesarlo. Por eso esta versión **todavía no transpone el sonido del video**: el control de semitonos adapta los acordes escritos, no el audio. La velocidad de YouTube tampoco garantiza todos los valores para todos los videos.

Se agregó una extensión experimental propia de Chrome en la carpeta [chrome-extension](./chrome-extension/). Captura el audio de la pestaña activa con `chrome.tabCapture`, lo procesa mediante AudioWorklet y recibe los semitonos desde el control de esta misma Sala. Para activarla hay que instalar la carpeta como extensión descomprimida y hacer clic una vez en su icono con la pestaña de la Sala activa. Después, los controles permanecen dentro de `tono.html`. El procesador granular es un prototipo: puede generar artefactos y todavía requiere pruebas reales de audio y compatibilidad antes de considerarse terminado. No descarga ni re-almacena canciones.

## Repertorio

El catálogo de trabajo está en [repertorio-30.json](./repertorio-30.json). Los enlaces de YouTube precargados son referencias de partida, no certificación de que cada versión sea la grabación correcta. Para “Bum, bum, bum” de Omega la identidad del tema y su álbum *Lo Que Suena* están documentados, pero todavía no hay un video de YouTube verificado cargado en la Sala; se puede conectar el enlace correcto cuando la banda lo confirme.

## Datos y privacidad

- Letras, acordes y enlaces elegidos se guardan en el almacenamiento local del navegador.
- No hay cuentas ni sincronización automática entre dispositivos.
- El audio de YouTube no se descarga ni se sube al repositorio.
- Para compartir fichas entre músicos habrá que incorporar exportación/importación o una base sincronizada en una etapa posterior.

## Publicar con GitHub Pages

En el repositorio, abrir **Settings → Pages**, seleccionar **Deploy from a branch**, rama `main`, carpeta `/(root)` y guardar.

URL prevista: https://eliasmartinezcultural-glitch.github.io/proyecto-musical/

Después de publicar, probar en Chrome de escritorio: reproducción embebida, enlaces que permiten inserción, velocidad disponible, repetición A–B y guardado local. La extensión de audio es solo para Chrome de escritorio; no se instala en Android ni en iPhone. GitHub Pages puede tardar unos minutos en actualizarse y el service worker puede conservar una versión anterior; recargar la página o borrar los datos del sitio si no aparecen los cambios.

## Principios

Primero el oído, lo visual y lo práctico. Lenguaje cotidiano, botones grandes y trabajo de voz, teclado y guitarra sin exigir lectura musical.
