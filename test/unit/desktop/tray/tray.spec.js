const assert = require('assert');
var proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const expect = require('chai').expect;
class tray {
    constructor() {
        this.init = true;
    }
    setToolTip(toolTip) {
        this.toolTip = toolTip;
    }
    on(opts) {
        this.lastOn = opts;
    }
    popUpContextMenu() {
        this.popUpContextMenuAdded = true;
    }
}
const ipcMain = {
    on: () => {
        ipcMain.onCalled = true;
    },
    send: (args) => {
        ipcMain.lastSend = args;
    }
};
const Menu = {
    buildFromTemplate(items) {
        Menu.totalOptions = items.length;
    }
};
const app = {
    on: () => {
        app.onCalled = true;
    }
};
class BrowserWindowStub {
    constructor() {
        this._isVisible = false;
        this.height = 55;
        this.width = 56;
    }
    setBounds(opts){
        this.bounds = opts;
    }
    show(){
        this._isVisible = true;
    }
    getBounds() {
        return { height: this.height, width: this.width };
    }
    hide() {
        this._isVisible = false;
    }
    isVisible() {
        return this._isVisible;
    }
}
let electronStub = {
    BrowserWindow: BrowserWindowStub,
    Tray: tray,
    app: app,
    Menu: Menu,
    ipcMain: ipcMain
};
var mainWindow = new BrowserWindowStub();
const CustomTray = proxyquire('../../../../src/desktop/tray/tray', { 'electron': electronStub });
describe('Loading tray root module', function () {
    let appTray;
    beforeEach(() => {
        appTray = new CustomTray("path", mainWindow);
    });
    it('Tool Tip is added to tray icon', function () {
        expect(appTray.toolTip).to.equal('desktop Uploader');
    });
    it('Tray icon right click is aded', function () {
        expect(appTray.lastOn).to.equal('right-click');
    });
    it('calling right click event = context menu added', function () {
        appTray.onRightClick();
        expect(appTray.popUpContextMenuAdded).to.be.true;
    });
    it('calling right click event = menu item QUIT added', function () {
        appTray.onRightClick();
        expect(Menu.totalOptions).to.equal(1);
    });
    it('calling click event when window is hidden', function () {
        const bounds = {
            x: 45, y: 45
        };
        appTray.onClick(null, bounds);
        expect(mainWindow._isVisible).to.be.true;
    });
    it('calling click event when window is already visible', function () {
        mainWindow._isVisible = true;
        const bounds = {
            x: 45, y: 45
        };
        appTray.onClick(null, bounds);
        expect(mainWindow._isVisible).to.be.false;
    });
});
