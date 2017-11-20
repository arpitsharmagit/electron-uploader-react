const electron = require('electron');
const path = require("path");
let appSettings = require('./config').get("appSetting");
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const TrayHelper = require('./src/desktop/tray/root');
autoUpdater.logger = console.log.bind(console);
const { app, BrowserWindow, ipcMain, dialog, shell, crashReporter } = electron;
// init crashReporter with config parameters using  backtrace.io
crashReporter.start(appSettings.crashReporter);
const { appHeight, appWidth, appToolbar } = appSettings;
const appName = `Desktop Uploader - ${app.getVersion()}`;
let mainWindow, tray;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

function makeSingleInstanceForUploader() {
  if (process.mas) { // True for Mac App Store build else undefined.
    return false;
  }
  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      } else if (!mainWindow.isVisible()) {
        mainWindow.show();
      }
      mainWindow.focus();
    }
  });
}

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Desktop Uploader - Checking update...');
});

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow(appName + ' - New update is available!');
});

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow(appName);
});

autoUpdater.on('error', (err) => {
  log.info(`error in updating app ${err}`);
});

autoUpdater.on('download-progress', (progressObj) => {
  sendStatusToWindow(appName + ` - [${Math.round(progressObj.percent)}%] downloading update...`);
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  dialog.showMessageBox({
    type: 'question',
    buttons: ['Install and Relaunch', 'Later'],
    defaultId: 0,
    message: 'A new version of ' + app.getName() + ' has been downloaded',
    detail: `Do you want to install it now?`
  }, response => {
    if (response === 0) {
      setTimeout(() => autoUpdater.quitAndInstall(), 1);
    }
  });
});

app.on('ready', () => {
  if (makeSingleInstanceForUploader()) {
    return app.quit();
  }
  mainWindow = new BrowserWindow({
    height: appHeight,
    width: appWidth,
    toolbar: appToolbar,
    frame: false,
    resizable: false,
    title: appName,
    backgroundColor: '#EEEEEE',
    webPreferences: { backgroundThrottling: false },
    icon: path.join(__dirname, 'src/assets/images/uploadericon.ico'),
    show: false
  });
  mainWindow.loadURL(`file://${__dirname}/src/index.html#v${app.getVersion()}`);
  // mainWindow.webContents.openDevTools();
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    autoUpdater.checkForUpdates();
  });
  mainWindow.on('close', event => {
    if (!app.exitNU) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
  TrayHelper.init();
});
app.on('window-all-closed', () => {
  if (process.platform !== "darwin") {
    mainWindow = null;
    app.quit();
  }
});

ipcMain.on('tray-event-tray-open', (event, data) => {
  mainWindow && mainWindow.show();
});


process.on('uncaughtException', (err) => {
  process.crash();
});

ipcMain.on('loadGH', (event, arg) => {
  shell.openExternal(arg);
});
