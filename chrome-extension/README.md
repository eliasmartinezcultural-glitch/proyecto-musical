# Ocarina · Transpositor de Sala 0.4.0

Extensión de Chrome de escritorio para cambiar en tiempo real el tono del audio que se reproduce dentro de la Sala de Ensayo, sin cambiar el tempo.

## Instalar en Chrome

1. Abrí el repositorio: https://github.com/eliasmartinezcultural-glitch/proyecto-musical
2. Elegí **Code → Download ZIP** y descomprimí el archivo.
3. Abrí `chrome://extensions`.
4. Activá **Modo de desarrollador**.
5. Elegí **Cargar descomprimida** y seleccioná la carpeta `chrome-extension` dentro del ZIP.
6. Si tenías una versión anterior, quitála primero desde `chrome://extensions`.
7. Abrí la Sala publicada en GitHub Pages y reproducí una canción.
8. Hacé clic en el icono de Ocarina. Esperá **Signalsmith listo**.
9. Mové el control de semitonos desde la Sala.

El icono solo inicia captura cuando la pestaña activa pertenece a la Sala de Ensayo. Un segundo clic detiene el motor. También podés detenerlo desde la propia Sala.

## Motor de audio

- **Signalsmith Stretch Web Audio**, compilado a WASM y AudioWorklet, se incluye localmente en `vendor/SignalsmithStretch.mjs`.
- La captura se realiza con `chrome.tabCapture` después de un clic explícito del usuario; el procesamiento ocurre en un documento offscreen.
- El audio se devuelve a la salida del navegador. Se procesa localmente; no se suben ni guardan pistas.
- Cambio de -12 a +12 semitonos. La velocidad de reproducción y la tonalidad son independientes.
- El motor recibe entrada normalizada a dos canales para manejar capturas mono o estéreo.
- La latencia del motor se consulta una vez al iniciar y se reutiliza para programar los cambios de tono.
- El evento de fin de pista de audio detiene el motor y actualiza el estado de la Sala.

## Modos de procesamiento

La Sala ofrece dos modos basados en los presets oficiales de Signalsmith:

- **Calidad estándar**: preset predeterminado del motor.
- **Ahorro de CPU**: preset `cheaper`, pensado para equipos con menos capacidad de procesamiento.

La selección se guarda en el almacenamiento local de la extensión y sobrevive a reinicios del service worker. Si cambiás de modo con el motor activo, detenelo y volvé a activarlo para aplicar la nueva configuración. Ahorro de CPU no significa necesariamente menor latencia ni mayor calidad.

## Formantes

La compensación de formantes está desactivada por defecto. Puede probarse desde la Sala, pero actúa sobre la mezcla completa y no separa la voz de los instrumentos. En una canción polifónica puede alterar timbres instrumentales; compará ambas posiciones y dejala desactivada si el resultado empeora.

## Créditos y licencia

Motor: https://github.com/Signalsmith-Audio/signalsmith-stretch

La versión Web se tomó del archivo `web/release/SignalsmithStretch.mjs` (blob upstream `7d5cae72e77a84143ed91ba12fc91b806dc4d9d1`). Licencia MIT incluida en `vendor/LICENSE-SignalsmithStretch.txt`.

## Requisitos y límites

- Chrome de escritorio 116 o posterior.
- GitHub Pages debe estar publicado por HTTPS en el dominio configurado en `manifest.json`.
- Chrome exige activación explícita desde el icono de la extensión.
- La extensión no se instala automáticamente ni funciona como extensión en Android/iPhone.
- La calidad sonora, la latencia percibida y la estabilidad deben validarse en Chrome real y con auriculares. Las pruebas automatizadas de lógica no certifican la calidad de audio.
- Algunos videos pueden bloquear la reproducción insertada. La extensión no descarga, extrae ni evita protecciones de contenido.

## Prueba auditiva

1. Confirmá que la canción suena normalmente dentro de la Sala.
2. Activá el motor y esperá el mensaje de listo.
3. Probá 0, +1, -1, +2, -2, +5 y -5 semitonos.
4. Confirmá que el tempo no cambia al mover el tono.
5. Compará calidad estándar y ahorro de CPU, reiniciando el motor entre modos.
6. Compará formantes apagados y encendidos.
7. Pausá, reanudá, cambiá de canción y detené el motor.
8. Confirmá que el audio vuelve a la salida normal al detenerlo.

**Estado honesto:** la integración, los modos y la limpieza de captura están implementados. La calidad auditiva, la carga de WASM/AudioWorklet y la latencia en el equipo real siguen pendientes de validación manual.
