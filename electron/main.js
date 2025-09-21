
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const https = require('https');
const { autoUpdater } = require('electron-updater');
require('dotenv').config();

let mainWindow;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 630,
    autoHideMenuBar: true, // скрыть меню
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    resizable: false,
    maximizable: false,
    frame: false,
    titleBarStyle: 'hidden',
  });

  // IPC обработчики для кнопок управления окном
  ipcMain.on('window-minimize', () => mainWindow.minimize());
  ipcMain.on('window-maximize', () => mainWindow.maximize());
  ipcMain.on('window-close', () => mainWindow.close());

  // Пинг по http (HEAD запрос)
  ipcMain.handle('ping-http', async (event, url) => {
    return new Promise((resolve) => {
      const start = Date.now();
      try {
        const req = https.request(url, { method: 'HEAD', timeout: 3500 }, (res) => {
          res.on('end', () => {
            resolve(Date.now() - start);
          });
          res.resume();
        });
        req.on('timeout', () => {
          req.destroy();
          resolve(null);
        });
        req.on('error', () => resolve(null));
        req.end();
      } catch {
        resolve(null);
      }
    });
  });

  // ПРАВИЛЬНАЯ ПРОВЕРКА РЕЖИМА
  const isDev = process.env.NODE_ENV === 'development';

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../app/out/index.html')}`;

  mainWindow.loadURL(startUrl);


  // Открытие DevTools по F12
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'F12') {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
      event.preventDefault();
    }
  });

  // Настройка авто-обновления
  setupAutoUpdater();
}

function setupAutoUpdater() {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('checking-for-update', () => {
    mainWindow.webContents.send('update-checking');
  });

  autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('update-available', info);
  });

  autoUpdater.on('update-not-available', (info) => {
    mainWindow.webContents.send('update-not-available', info);
  });

  autoUpdater.on('download-progress', (progress) => {
    mainWindow.webContents.send('download-progress', progress);
  });

  autoUpdater.on('update-downloaded', (info) => {
    mainWindow.webContents.send('update-downloaded', info);
    mainWindow.webContents.send('update-ready');
  });

  autoUpdater.on('error', (error) => {
    mainWindow.webContents.send('update-error', error);
  });

  // Автопроверка при запуске
  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 5000);
}

// IPC обработчики для обновления
ipcMain.handle('install-update', () => {
  autoUpdater.quitAndInstall();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});