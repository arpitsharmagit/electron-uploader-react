const electron = require('electron');
const { Tray, app, Menu } = electron;
class DesktopTray extends Tray {
    constructor(iconPath, mainWindow) {
        super(iconPath);
        this.mainWindow = mainWindow;
        this.setToolTip('Desktop Uploader');
        this.on('click', this.onClick.bind(this));
        this.on('right-click', this.onRightClick.bind(this));
    }

    onClick(event, bounds) {
        const { x, y } = bounds;
        const { height, width } = this.mainWindow.getBounds();
        if (this.mainWindow.isVisible()) {
            this.mainWindow.hide();
        } else {
            const yPosition = process.platform === 'darwin' ? y : parseInt(y - height);
            this.mainWindow.setBounds({
                x: parseInt(x - width + 70),
                y: yPosition,
                height,
                width
            });
            this.mainWindow.show();
        }
    }
    onRightClick() {
        const menuConfig = Menu.buildFromTemplate([
            {
                label: 'Quit',
                click: () => {
                    app.exitNU = true;
                    app.quit();
                }
            }
        ]);

        this.popUpContextMenu(menuConfig);
    }
}

module.exports = DesktopTray;
