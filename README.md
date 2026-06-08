# Edén La Radio

Web app/PWA para Edén La Radio.

## Cómo subir a GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube estos archivos en la raíz del repositorio:
   - index.html
   - style.css
   - script.js
   - manifest.json
   - service-worker.js
3. Ve a Settings > Pages.
4. En Branch selecciona `main` y carpeta `/root`.
5. Guarda y espera a que GitHub genere el enlace.

## Stream actual

https://radio.megahostec.com:8000/stream

## Metadata

En `script.js`, cambia esta línea cuando tengas la API exacta de AzuraCast:

```js
metadataApi: ""
```

Ejemplo:

```js
metadataApi: "https://radio.megahostec.com/api/nowplaying/eden_la_radio"
```
