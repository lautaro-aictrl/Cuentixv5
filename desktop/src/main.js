const { app, BrowserWindow, Menu, nativeTheme, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const fs = require('fs');
const path = require('path');

const APP_URL = process.env.CUENTIX_APP_URL || 'https://cuentixv5-fzpu.vercel.app';
const BOUNDS_FILE = 'window-state.json';

let mainWindow;
let splashWindow;

function userDataPath(file) {
  return path.join(app.getPath('userData'), file);
}

function readWindowState() {
  try {
    return JSON.parse(fs.readFileSync(userDataPath(BOUNDS_FILE), 'utf8'));
  } catch {
    return { width: 1280, height: 820 };
  }
}

function saveWindowState(win) {
  if (!win || win.isDestroyed() || win.isMinimized()) return;
  const bounds = win.getBounds();
  fs.writeFileSync(userDataPath(BOUNDS_FILE), JSON.stringify(bounds, null, 2));
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 460,
    height: 300,
    frame: false,
    resizable: false,
    show: true,
    center: true,
    transparent: true,
    alwaysOnTop: true,
    backgroundColor: '#00000000',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  splashWindow.loadFile(path.join(__dirname, 'splash.html'));
}

function createMainWindow() {
  const state = readWindowState();

  mainWindow = new BrowserWindow({
    width: state.width || 1280,
    height: state.height || 820,
    x: state.x,
    y: state.y,
    minWidth: 1040,
    minHeight: 680,
    show: false,
    title: 'CUENTIX',
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#071827' : '#eef3f8',
    icon: path.join(__dirname, '..', 'build', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      devTools: !app.isPackaged
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const target = new URL(url);
    const appOrigin = new URL(APP_URL).origin;
    if (target.origin !== appOrigin) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.webContents.on('before-input-event', (event, input) => {
    const key = input.key.toLowerCase();
    if ((input.control || input.meta) && ['+', '-', '=', '0'].includes(key)) {
      event.preventDefault();
    }
  });

  mainWindow.webContents.on('zoom-changed', (event) => {
    event.preventDefault();
    mainWindow.webContents.setZoomFactor(1);
  });

  mainWindow.webContents.setVisualZoomLevelLimits(1, 1);

  mainWindow.once('ready-to-show', () => {
    if (splashWindow && !splashWindow.isDestroyed()) splashWindow.close();
    mainWindow.show();
  });

  mainWindow.webContents.on('did-fail-load', () => {
    mainWindow.loadFile(path.join(__dirname, 'offline.html'));
  });

  mainWindow.on('close', () => saveWindowState(mainWindow));
  mainWindow.loadURL(APP_URL);
}

function configureAutoUpdates() {
  if (!app.isPackaged) return;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('error', () => {});
  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify().catch(() => {});
  }, 8000);
}

app.setName('CUENTIX');
Menu.setApplicationMenu(null);

app.whenReady().then(() => {
  createSplashWindow();
  createMainWindow();
  configureAutoUpdates();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createSplashWindow();
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
