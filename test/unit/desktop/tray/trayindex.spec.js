const assert = require('assert');
var proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const expect = require('chai').expect;
class tray {
    constructor() {
        this.init = true;
    }
}
const ipcMain = {
    onList: {},
    isSendcalled: false,
    on: (subName, cb) => {
        ipcMain.onList[subName] = cb;
    }
};
const app = {
    on: () => {
        app.onCalled = true;
    }
};
class BrowserWindowStub {
    loadURL() {

    }
    onBlur() {

    }
}
class DesktopTray {
    static isCalled = false;
    static iconPath = "";
    constructor(iconPath, mainWindow) {
        DesktopTray.isCalled = true;
        DesktopTray.iconPath = iconPath;
    }
}
class TrayWindow {
    static isSendcalled = false;
    static isCalled = false;
    constructor() {
        TrayWindow.isCalled = true;
    }
    webContents = {
        send: function () {
            TrayWindow.isSendcalled = true;
        }
    }
}
const shellMock = {
    openExternal: () => {
        shellMock.openExternalLink = true;
    }
};
let electronStub = {
    app: app,
    ipcMain: ipcMain,
    shell: shellMock
};
const trayUtil = proxyquire('../../../../src/desktop/tray/root', {
    'electron': electronStub,
    './tray': DesktopTray,
    './trayWindow': TrayWindow,
    '@global': false
});
describe('Loading tray root module', function () {
    beforeEach(() => {
        trayUtil.init();
    });
    describe('Calling Methods', function () {
        it('Init method', function () {
            expect(DesktopTray.isCalled).to.be.true;
            expect(DesktopTray.isCalled).to.be.true;
        });
        it('subscribeIPC method', function () {
            trayUtil.subscribeIPC();
            expect(ipcMain.onList).to.have.a.property('tray-event-upload');
        });
        it('calling IPC event', function () {
            ipcMain.onList['tray-event-upload']();
            assert(TrayWindow.isSendcalled);
        });
        it('tray-event-web-open on IPC', function () {
            ipcMain.onList['tray-event-web-open']();
            expect(shellMock.openExternalLink).to.be.true;
        });
        describe('Non Win32', function () {
            beforeEach(function () {
                this.currentPlatform = Object.getOwnPropertyDescriptor(process, 'platform');

                Object.defineProperty(process, 'platform', {
                    value: 'mac'
                });
                trayUtil.init();
            });

            afterEach(function () {
                Object.defineProperty(process, 'platform', this.currentPlatform);
            });

            it('calling for not win32', function () {
                expect(DesktopTray.iconPath).to.have.string('uploaderTaryIcon-mac.png');
            });
        });
    });
});
