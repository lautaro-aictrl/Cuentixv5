# CUENTIX Desktop

Aplicacion de escritorio para Windows que abre CUENTIX desde:

`https://cuentixv5-fzpu.vercel.app`

## Por que Electron

Electron es la opcion mas practica para CUENTIX porque permite generar un instalador `.exe`, crear accesos directos, usar icono propio, mostrar splash screen y abrir la app en una ventana independiente sin barra de navegador.

Como la app carga la URL de Vercel, cada deploy nuevo del frontend se ve automaticamente en la app instalada sin volver a compilar el instalador.

## Archivos

- `package.json`: dependencias, scripts y configuracion de instalador Windows.
- `src/main.js`: proceso principal Electron, ventana, splash, bloqueo de zoom, memoria de posicion/tamano y auto update.
- `src/preload.js`: puente seguro minimo entre Electron y la web.
- `src/splash.html`: pantalla de carga profesional.
- `src/offline.html`: pantalla de recuperacion si no hay internet.
- `assets/icon.svg`: icono fuente de CUENTIX.
- `scripts/create-icons.js`: genera `icon.ico` y PNGs desde el SVG.
- `build/`: se crea automaticamente con iconos.
- `dist/`: se crea automaticamente con el instalador `.exe`.

## Instalar dependencias

```bash
cd desktop
npm install
```

## Probar en modo desarrollo

```bash
npm run dev
```

## Generar instalador para Windows

```bash
npm run dist
```

El instalador queda en:

`desktop/dist/CUENTIX-Setup-1.0.0.exe`

## Acceso directo

El instalador NSIS crea automaticamente:

- acceso directo en Escritorio
- acceso directo en Menu Inicio
- aplicacion llamada `CUENTIX`

## Actualizaciones

Hay dos niveles:

1. Frontend: como la ventana carga Vercel, cualquier deploy nuevo en `https://cuentixv5-fzpu.vercel.app` se ve automaticamente.
2. App de escritorio: si algun dia cambias Electron, icono o instalador, publicas una release en GitHub y `electron-updater` puede actualizar la app instalada.

La configuracion actual apunta a:

`lautaro-aictrl/Cuentixv5`

Si tu repo de GitHub tiene otro nombre, cambia `build.publish.owner` y `build.publish.repo` en `desktop/package.json`.
