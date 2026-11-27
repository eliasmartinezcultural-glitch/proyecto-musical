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
