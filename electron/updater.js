const { ipcMain, dialog, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const https = require('https');
const path = require('path');
const fs = require('fs');

class AutoUpdater {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.isUpdateDownloaded = false;
    this.setupAutoUpdater();
  }

  setupAutoUpdater() {
    autoUpdater.autoDownload = true; // Автоматическая загрузка!
    autoUpdater.autoInstallOnAppQuit = true; // Установка при выходе
    autoUpdater.allowPrerelease = false;

    autoUpdater.on('checking-for-update', () => {
      this.mainWindow.webContents.send('update-checking');
    });

    autoUpdater.on('update-available', (info) => {
      this.mainWindow.webContents.send('update-available', info);
      // Автоматически начинаем загрузку
      this.mainWindow.webContents.send('update-downloading');
    });

    autoUpdater.on('update-not-available', (info) => {
      this.mainWindow.webContents.send('update-not-available', info);
    });

    autoUpdater.on('download-progress', (progress) => {
      this.mainWindow.webContents.send('download-progress', progress);
    });

    autoUpdater.on('update-downloaded', (info) => {
      this.isUpdateDownloaded = true;
      this.mainWindow.webContents.send('update-downloaded', info);
      
      // Предлагаем установить сразу
      this.mainWindow.webContents.send('update-ready');
    });

    autoUpdater.on('error', (error) => {
      this.mainWindow.webContents.send('update-error', error);
    });
  }

  checkForUpdates() {
    autoUpdater.checkForUpdates();
  }

  installUpdate() {
    if (this.isUpdateDownloaded) {
      autoUpdater.quitAndInstall();
    }
  }
}

// IPC обработчики
function setupUpdateHandlers(mainWindow) {
  const updater = new AutoUpdater(mainWindow);

  ipcMain.handle('install-update', () => {
    updater.installUpdate();
  });

  // Автопроверка при запуске
  ipcMain.handle('auto-check-updates', () => {
    updater.checkForUpdates();
  });
}

module.exports = { setupUpdateHandlers };