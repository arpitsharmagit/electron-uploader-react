const assert = require('assert');
const sinon = require('sinon');
const expect = require('chai').expect;
const proxyquire = require('proxyquire').noCallThru();
class TrayState {
    constructor() {
        this.totalFiles = 0;
        this.uploaded = 0;
        this.failed = 0;
        this.cancel = 0;
    }
    getStatus() {
        return 'TEST';
    }
    getPercentage() {
        return '4%';
    }
    updateTotalFiles(c) {
        this.totalFiles = c;
    }
    updateFailedFiles() {
        this.failed++;
    }
    updateSuccessFiles() {
        this.uploaded++;
    }
    getPercentageWidth() {
        return '44';
    }
    cancelFile() {
        this.cancel++;
    }
    decrementFailed() {
        this.failed--;
    }
}
const trayStateMock = new TrayState();
const ipcRenderer = {
    onList: {},
    isSendcalled: false,
    on: (subName, cb) => {
        ipcRenderer.onList[subName] = cb;
    },
    send: (args) => {
        ipcRenderer.isSendcalled = true;
    }
};
let electronStub = {
    ipcRenderer: ipcRenderer
};
const eventList = { 'click': [] };
const addEventListenerMock = (eventName, cb) => {
    eventList[eventName] = eventList[eventName] || [];
    eventList[eventName].push(cb);
};
sinon.stub(document, 'getElementById').returns({
    addEventListener: addEventListenerMock, style: {
        width: 30
    }
});
const trayScript = proxyquire('../../../../src/desktop/tray/script/tray',
    {
        'electron': electronStub,
        './trayState': trayStateMock
        });

describe('Loading tray script', function () {
    let appTray;
    it('Check subcription for ipc upload events', function () {
        expect(ipcRenderer.onList).to.have.a.property('tray-event-upload');
    });
    describe('Calling dom events', function () {
        it('calling click event', function () {
            const clickEvents = eventList.click;
            for (let i = 0; i < clickEvents.length; i++) {
                clickEvents[i]();
            }
            expect(ipcRenderer.isSendcalled).to.be.true;
        });
    });
    describe('Calling IPC events', function () {
        it('event type file add', function () {
            ipcRenderer.onList['tray-event-upload'](null, {
                type: 'FILEADD',
                count: 5
            });
            expect(trayStateMock.totalFiles).to.equal(5);
        });
        it('event type UPLOAD_COMPLETE', function () {
            ipcRenderer.onList['tray-event-upload'](null, {
                type: 'UPLOAD_COMPLETE'
            });
            expect(trayStateMock.uploaded).to.equal(1);
        });
        it('event type UPLOAD_FAILED', function () {
            ipcRenderer.onList['tray-event-upload'](null, {
                type: 'UPLOAD_FAILED'
            });
            expect(trayStateMock.failed).to.equal(1);
        });
        it('event type UPLOAD_CANCEL', function () {
            ipcRenderer.onList['tray-event-upload'](null, {
                type: 'UPLOAD_CANCEL'
            });
            expect(trayStateMock.cancel).to.equal(1);
        });
        it('event type UPLOAD_RETRY', function () {
            ipcRenderer.onList['tray-event-upload'](null, {
                type: 'UPLOAD_RETRY'
            });
            expect(trayStateMock.failed).to.equal(0);
        });
    });
});
