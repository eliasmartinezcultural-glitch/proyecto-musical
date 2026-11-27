# Elías Martínez · Cuarteto — Sala de ensayo

Aplicación web mobile-first para practicar cuarteto en grupo, sin necesitar leer partituras.

## Repertorio curado

La sala incorpora un catálogo inicial de 30 canciones distribuidas entre Pepo Lara (7), Omega (8), Banda Registrada (8) y Jean Carlos (7).

Las primeras diez tienen fichas de trabajo con acordes disponibles, tonalidad/tempo cuando existe una fuente, propuesta de arreglo para voz, teclado y guitarra, estructura orientativa y referencia externa. **Nueve de las diez fichas ya muestran progresiones de acordes; en “No lo beses” de Pepo Lara solo se encontraron tonalidad y tempo (C♯ menor, 150 BPM), por lo que la progresión queda pendiente de cotejo auditivo.** No se inventa para completar un casillero.

### Primera tanda de 10

1. Pepo Lara — 5 Minutos
2. Pepo Lara — No lo beses
3. Omega — La Mariposa
4. Omega — Mi razón de ser
5. Omega — Te Deseo
6. Banda Registrada — Víveme
7. Banda Registrada — Clávame tu amor
8. Banda Registrada — Kilómetros
9. Jean Carlos — Quiéreme
10. Jean Carlos — Tu amante en secreto

El listado completo y sus estados de verificación están en [repertorio-30.json](./repertorio-30.json).

## Herramientas de ensayo

- Fichas de canciones con artista, tono, letra/acordes y notas.
- Reproductor para pistas elegidas desde el propio celular o computadora.
- Controles para pausar, avanzar y retroceder; repetición de pista.
- Impresión de letras.
- Metrónomo ajustable y estimación de tempo marcando palmas.
- Transposición de acordes por semitonos en las fichas del catálogo.
- Visualización de las notas que forman cada acorde en un teclado.
- Propuestas de arreglo separadas por voz, teclado y guitarra.
- Taller práctico, método para sacar canciones de oído, vocabulario común y plan de ensayo de 60 minutos.
- Organización de repertorio para shows y registro de prácticas.
- Exportación e importación de copias JSON.
- Manifiesto de aplicación y service worker con caché básica para uso offline después de la primera carga.

## Publicar con GitHub Pages

1. Abrir **Settings** del repositorio.
2. Entrar en **Pages**.
3. En **Build and deployment**, elegir **Deploy from a branch**.
4. Seleccionar la rama `main` y la carpeta `/ (root)`.
5. Guardar y esperar a que GitHub publique el sitio.

Dirección prevista: https://eliasmartinezcultural-glitch.github.io/proyecto-musical/

## Instalar en el celular

Una vez publicado por HTTPS, abrir el enlace desde Chrome en Android y elegir **Instalar aplicación** o **Agregar a pantalla de inicio** desde el menú del navegador. La primera visita requiere conexión para guardar los archivos básicos.

## Importante

- Los arreglos de voz, teclado y guitarra son propuestas originales para esta formación, no transcripciones oficiales de los arreglos de estudio.
- Las fuentes de acordes pueden diferir entre versiones y transcripciones. El tono definitivo se decide contrastando con el audio y con la comodidad vocal de Elías.
- El transpositor modifica los nombres de acordes escritos, no la tonalidad del archivo de audio.
- Las canciones, notas y prácticas se guardan en el almacenamiento local del navegador y dispositivo.
- Los datos no se sincronizan automáticamente entre teléfonos. Para compartirlos, exportar una copia JSON e importarla en el otro dispositivo.
- Las pistas de audio se seleccionan localmente y no se suben al repositorio ni se incluyen en las copias JSON.
- El cambio real de tono del audio (pitch shifting sin alterar la velocidad) y la sincronización simultánea entre músicos quedan para una etapa posterior.
- Descargá una copia de seguridad después de cada ensayo importante.

## Principios del proyecto

Primero el oído, lo visual y lo práctico. Lenguaje cotidiano, botones grandes y navegación simple para músicos populares que están aprendiendo juntos.


## Reproductor online de ensayo

Se incorporó una sala de reproducción basada en el reproductor oficial de YouTube (IFrame Player API). No descarga ni copia archivos de audio: reproduce los videos desde YouTube dentro de la página.

Funciones implementadas:
- Reproducción y pausa.
- Avance y retroceso de 5 y 10 segundos.
- Barra de posición y duración.
- Control de volumen.
- Selector de velocidad (solo valores que el video admite).
- Marcadores A y B con repetición de fragmento.
- Navegación anterior/siguiente entre canciones que ya tienen una fuente conectada.
- Enlace de YouTube guardado localmente por canción; se puede conectar una versión exacta pegando su URL y, si es un medley, el segundo de inicio.
- Acceso desde el reproductor a la ficha de acordes y arreglo.

Fuentes conectadas de partida:
- Pepo Lara — 5 Minutos (canal Pepo Lara - Topic).
- Omega — La Mariposa (video oficial).
- Omega — Mi razón de ser (video de referencia publicado por Canal 13 San Juan).
- Omega — Te Deseo ft. Monada (video oficial).
- Banda Registrada — Kilómetros (referencia vinculada desde Chordify).
- Jean Carlos — Quiéreme, Tu amante en secreto, A puro dolor, Piensa en mí, Regresa a mí y Tú vas a volar (segmentos con inicio marcado dentro de una presentación en vivo de Un Poco de Ruido).

Para otras canciones, el botón Conectar permite buscar la versión en YouTube y guardar el enlace una sola vez. Hay que verificar que sea la versión correcta y que el titular permita su reproducción embebida.

### Limitaciones importantes

- YouTube permite controlar reproducción, pausa, volumen, posición y velocidades disponibles, pero no garantiza todas las velocidades en todos los videos.
- La API de YouTube no entrega el audio interno para que esta página lo procese. Por eso, en este modo no se puede cambiar el tono del audio de manera independiente.
- El transpositor de acordes sí cambia los acordes escritos, pero eso no cambia el tono de la grabación.
- Para tener cambio real de tono y tempo independiente en la grabación sin subir archivos locales, necesitamos una fuente de audio directa, accesible desde el navegador y autorizada para ese uso (por ejemplo, un stream de pistas propias o con permiso del titular y CORS habilitado). Con esa fuente se puede integrar un motor de audio como SoundTouchJS AudioWorklet. No se debe extraer audio de YouTube ni de Spotify.
- Los enlaces y preferencias agregados por el usuario se guardan en el almacenamiento local del navegador de ese dispositivo. No se sincronizan automáticamente entre los celulares de los tres músicos.

El reproductor es un primer motor online funcional a nivel de interfaz y control API; antes de declararlo probado en producción, hay que verificarlo en la URL publicada, en Chrome Android y en Safari/iPhone, y comprobar los permisos de reproducción de cada video.


## Sala de tono en tiempo real

Se agregó `tono.html`, una pantalla de cuatro funciones: reproducción de audio directo, cambio real de tono en semitonos en tiempo real, velocidad independiente y letra/acordes con transposición visual. Utiliza SoundTouchJS AudioWorklet (MPL-2.0). No sube audio: el usuario pega una URL directa. La fuente debe permitir reproducción desde el navegador y CORS; enlaces de YouTube/Spotify/páginas web no son fuentes de audio directo procesables. La pantalla guarda la URL y las notas localmente. El funcionamiento debe probarse con una fuente de audio CORS habilitada en Chrome/Android y Safari.
