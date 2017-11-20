const assert = require('assert');
var proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const expect = require('chai').expect;
class BrowserWindowStub {
    constructor(opts) {
        this.height = opts.height;
        this.width = opts.width;
        this.events = [];
    }
    loadURL() {

    }
    hide() {
        this.hidden = true;
    }
    on(event){
        this.events.push(event);
    }
}
let electronStub = {
    BrowserWindow: BrowserWindowStub
};
const TrayWindow = proxyquire('../../../../src/desktop/tray/trayWindow', {
    'electron': electronStub
});
const trayWindow = new TrayWindow("");
describe('Loading tray window', function () {
    it('Checking dimensions :', function () {
        expect(trayWindow.height).to.equal(75);
        expect(trayWindow.width).to.equal(639);
    });
    it('Calling Hide :', function () {
        trayWindow.hide();
        expect(trayWindow.hidden).to.be.true;
    });
});
