# Elías Martínez · Cuarteto — Sala de ensayo

Aplicación web mobile-first para practicar cuarteto en grupo, sin necesitar leer partituras.

## Qué incluye

- Fichas de canciones con artista, tono, letra, acordes y notas de ensayo.
- Reproductor para pistas elegidas desde el propio celular o computadora.
- Controles para pausar, avanzar y retroceder; repetición de pista.
- Impresión de letras.
- Guía visual de acordes abiertos de guitarra: SOL, RE, MIm y DO.
- Metrónomo ajustable y estimación de tempo marcando palmas.
- Transpositor de nombres de acordes en letras. Cambia el texto, no el audio.
- Taller práctico para voz, teclado y guitarra.
- Método para sacar canciones de oído, vocabulario común y plan de ensayo de 60 minutos.
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

- Las canciones, notas y prácticas se guardan en el almacenamiento local del navegador y dispositivo.
- Los datos no se sincronizan automáticamente entre teléfonos. Para compartirlos, exportar una copia JSON e importarla en el otro dispositivo.
- Las pistas de audio se seleccionan localmente y no se suben al repositorio ni se incluyen en las copias JSON. Cada músico debe elegir el archivo de audio en su propio dispositivo.
- El transpositor cambia los nombres de acordes escritos; no cambia la tonalidad del audio.
- El cambio real de tono del audio (pitch shifting sin alterar la velocidad) y la sincronización simultánea entre músicos quedan para una etapa posterior.
- Descargá una copia de seguridad después de cada ensayo importante.

## Principios del proyecto

Primero el oído, lo visual y lo práctico. Lenguaje cotidiano, botones grandes y navegación simple para músicos populares que están aprendiendo juntos.