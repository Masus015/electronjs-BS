const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),

  getPlatform: () => process.platform,
  pingHttp: (url) => ipcRenderer.invoke('ping-http', url),

  // Обновления
  installUpdate: () => ipcRenderer.invoke('install-update'),
  
  // Слушатели событий обновлений
  onUpdateChecking: (callback) => ipcRenderer.on('update-checking', callback),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  onUpdateNotAvailable: (callback) => ipcRenderer.on('update-not-available', callback),
  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
  onUpdateReady: (callback) => ipcRenderer.on('update-ready', callback),
  onUpdateError: (callback) => ipcRenderer.on('update-error', callback),
  
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

contextBridge.exposeInMainWorld('electronStorage', {
  setItem: (key, value) => localStorage.setItem(key, value),
  getItem: (key) => { return localStorage.getItem(key) },
  removeItem: (key) => localStorage.removeItem(key),
});