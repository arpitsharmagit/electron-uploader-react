const electron = require('electron');
const { BrowserWindow } = electron;

class DesktopTrayWindow extends BrowserWindow {
    constructor(url) {
        super({
            height: 75,
            width: 639,
            frame: false,
            resizable: false,
            show: false,
            skipTaskbar: true,
            alwaysOnTop: true,
            webPreferences: { backgroundThrottling: false }
        });
        this.loadURL(url);
        this.on('blur', this.onBlur.bind(this));
    }
    onBlur() {
    //    this.hide();
    }
}

module.exports = DesktopTrayWindow;
