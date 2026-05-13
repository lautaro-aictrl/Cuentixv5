const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('cuentixDesktop', {
  platform: process.platform,
  version: process.env.npm_package_version || '1.0.0',
  isDesktop: true
});
