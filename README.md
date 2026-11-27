# Elías Martínez · Cuarteto — Sala de ensayo

Aplicación web mobile-first para practicar cuarteto en grupo, sin necesitar leer partituras.

## Primera versión

- Crear fichas de canciones con artista, tono, letra/acordes y notas.
- Seleccionar una pista de audio local y reproducirla durante la sesión.
- Pausar, avanzar y retroceder desde los controles del navegador.
- Imprimir letras.
- Guía visual de acordes abiertos de guitarra (SOL, RE, MIm y DO).\n- Metrónomo ajustable y detección aproximada de tempo con palmas.\n- Transpositor de nombres de acordes en letras (no modifica el audio).\n- Taller práctico con rutinas para voz, teclado y guitarra, método para sacar temas de oído, vocabulario común y plan de ensayo de 60 minutos.
- Organizar repertorio para shows.
- Registrar prácticas.
- Exportar e importar una copia JSON de los datos.

## Publicar con GitHub Pages

1. Abrir **Settings** del repositorio.
2. Entrar en **Pages**.
3. En **Build and deployment**, elegir **Deploy from a branch**.
4. Seleccionar la rama principal (normalmente `main`) y la carpeta `/ (root)`.
5. Guardar. GitHub mostrará la dirección pública cuando termine la publicación.

## Aplicación instalable\n\nLa aplicación incluye manifiesto y service worker para instalación y caché básica offline. Estas funciones requieren publicar por HTTPS (GitHub Pages sirve HTTPS). Después de publicar, abrí la página desde Chrome en el celular y usá el menú del navegador para instalar o agregar a pantalla de inicio. La primera visita necesita conexión para guardar los archivos básicos.\n\n## Importante

- Los datos se guardan en el almacenamiento local del navegador/dispositivo. No se sincronizan automáticamente entre teléfonos.
- Las pistas de audio se seleccionan desde el dispositivo y no se suben al repositorio.
- Exporten copias de seguridad periódicamente.
- El cambio de tonalidad real (pitch shifting sin alterar la velocidad), la sincronización entre músicos, el cambio de tono real del audio, la sincronización entre músicos, modo offline y funciones avanzadas de ensayo están planificados para etapas siguientes. Esta versión no simula esas funciones ni presenta controles falsos.
- Para usar en teléfonos, abrir el enlace de GitHub Pages desde el navegador. La instalación como aplicación y el modo offline se incorporarán después de probar la primera versión.

## Principios del proyecto

Primero el oído, lo visual y lo práctico. Lenguaje cotidiano, botones grandes, navegación simple y herramientas útiles para músicos populares que están aprendiendo juntos.
