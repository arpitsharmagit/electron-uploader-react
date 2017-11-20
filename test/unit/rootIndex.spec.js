const assert = require('assert');
var proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
var backtrace = require('backtrace-js');
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
    onList: {},
    on: (subName, cb) => {
        app.onList[subName] = cb;
    },
    getVersion: () => {
        return "1.0.1";
    },
    getName: () => {
        return "NU";
    }
};
class BrowserWindowStub {
    loadURL() {

    }
    onBlur() {

    }
    getAllWindows() {
        return [];
    }
}
class DesktopTray {
    static isCalled = false;
    constructor() {
        DesktopTray.isCalled = true;
    }
}

// logger.transports.file.level
const loggerMock = {
    logger: {
        transports: {
            file: {
                level: 'NOTSET'
            }
        }
    },
    log: {
        info: () => {

        },
        transports: {
            file: {
                level: 'NOTSET'
            }
        }
    },
    onList: {},
    on: (subName, cb) => {
        loggerMock.onList[subName] = cb;
    },
    quitAndInstall: () => {

    },
    checkForUpdates: () => {
    }
};
const trayHelperMock = {
    init: function () {
        trayHelperMock.initCalled = true;
    }
};
const shellMock = {
    openExternal: () => {
        shellMock.openExternalLink = true;
    }
};
const crashReporter = {
    start: () => {

    }
};

let electronStub = {
    BrowserWindow: BrowserWindowStub,
    Tray: tray,
    app: app,
    ipcMain: ipcMain,
    shell: shellMock,
    crashReporter: crashReporter
};
const updaterMock = {
    autoUpdater: loggerMock
};

describe('desktop uploader APP', function () {
    let spy_backtrace = null;
    beforeEach(function () {
        spy_backtrace = sinon.stub(backtrace, 'initialize').returns(true);
    });
    afterEach(function () {
        spy_backtrace && spy_backtrace.restore();
    });
    const NU_APP = proxyquire('../../index.js', {
        'electron': electronStub,
        'electron-updater': updaterMock,
        'electron-log': loggerMock.log,
        './src/desktop/tray': trayHelperMock
    });
    describe('INIT', function () {
        it('Logger is set to info', function () {
            expect(updaterMock.autoUpdater.logger.transports.file.level).to.be.equal('info');
        });
        describe('Firing IPC events', function () {
            let event;
            const allEvents = Object.keys(ipcMain.onList);
            for (event of allEvents) {
                // call event
                ipcMain.onList[event]();
            }
            it('Event subscribed in IPCmain', function () {
                expect(allEvents).to.have.lengthOf.above(1);
            });
            it('Shell command is given to open URL', function () {
                expect(shellMock.openExternalLink).to.be.true;
            });
        });
    });
});
