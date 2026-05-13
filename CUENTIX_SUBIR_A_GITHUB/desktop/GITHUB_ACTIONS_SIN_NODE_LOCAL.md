# Generar CUENTIX Desktop sin instalar Node.js localmente

Este metodo compila el instalador de Windows en GitHub Actions. Tu PC no necesita Node.js, npm, Electron ni permisos de administrador.

## Resultado

GitHub genera:

- `CUENTIX-Setup-1.0.0.exe`
- acceso directo automatico en Escritorio
- acceso directo en Menu Inicio
- icono CUENTIX
- ventana independiente sin barra del navegador
- splash screen
- app conectada a `https://cuentixv5-fzpu.vercel.app`

Como la app carga Vercel, cada cambio del frontend se ve automaticamente al abrir CUENTIX Desktop.

## Archivos que tenes que subir al repo

Subi estos archivos/carpetas a GitHub:

- `.github/workflows/build-cuentix-desktop.yml`
- `desktop/package.json`
- `desktop/src/main.js`
- `desktop/src/preload.js`
- `desktop/src/splash.html`
- `desktop/src/offline.html`
- `desktop/assets/icon.svg`
- `desktop/scripts/create-icons.js`

## Compilar desde GitHub sin instalar nada

1. Entra a tu repo de GitHub.
2. Abri la pestana `Actions`.
3. Elegi el workflow `Build CUENTIX Desktop`.
4. Toca `Run workflow`.
5. En `publish_release`, deja `false` para generar solo el instalador descargable.
6. Toca el boton verde `Run workflow`.
7. Espera que termine.
8. Abri la ejecucion finalizada.
9. Baja hasta `Artifacts`.
10. Descarga `CUENTIX-Windows-Installer`.

Dentro del ZIP vas a encontrar el `.exe`.

## Publicar release para auto-update

Para que `electron-updater` pueda actualizar la app de escritorio, necesitas publicar releases en GitHub.

Opcion simple:

1. En GitHub entra a `Actions`.
2. Ejecuta `Build CUENTIX Desktop`.
3. Cambia `publish_release` a `true`.
4. GitHub compila y publica la release con los archivos necesarios.

Opcion recomendada para produccion:

1. Cambia la version en `desktop/package.json`, por ejemplo de `1.0.0` a `1.0.1`.
2. Crea un tag en GitHub con este formato:

```text
desktop-v1.0.1
```

3. GitHub Actions publica automaticamente la release.

## Importante sobre updates

Hay dos tipos de actualizacion:

1. **Web CUENTIX:** se actualiza automaticamente cuando haces deploy en Vercel. No hace falta nuevo `.exe`.
2. **Desktop CUENTIX:** solo hace falta nueva release si cambias Electron, icono, splash, instalador o configuracion desktop.

## Si cambia el repo

En `desktop/package.json`, revisa:

```json
"publish": [
  {
    "provider": "github",
    "owner": "lautaro-aictrl",
    "repo": "Cuentixv5"
  }
]
```

Si tu repo real tiene otro nombre, cambia `owner` y `repo`.
