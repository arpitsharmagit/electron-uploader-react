const path = require('path');
const electron = require('electron');
const DesktopTray = require('./tray');
const DesktopTrayWindow = require('./trayWindow');
const { webURL } = require('../../../config').get("appSetting");
const { app, ipcMain, shell } = electron;
let mainWindow;
let tray;
class TrayUtil {
    init() {
        mainWindow = new DesktopTrayWindow(`file://${__dirname}/tray.html`);
        const iconName = process.platform === 'win32' ? 'uploaderTaryIcon.png' : 'uploaderTaryIcon-mac.png';
        const iconPath = path.join(__dirname, `../../assets/images/${iconName}`);
        tray = new DesktopTray(iconPath, mainWindow);
        this.subscribeIPC();
    }
    subscribeIPC() {
        ipcMain.on('tray-event-upload', (event, data) => {
            mainWindow && mainWindow.webContents.send('tray-event-upload', data);
        });
    }
}
app.on('before-quit', () => {
  mainWindow = null;
});
ipcMain.on('tray-event-web-open', () => {
  shell.openExternal(webURL);
});
module.exports = new TrayUtil();
