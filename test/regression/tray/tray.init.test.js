const common = require('../../utility/common');
const { Application, assert, path, chai, chaiAsPromised, expect } = common;

var electronPath = `${__dirname}/../../../node_modules/.bin/electron`;
var commands = require("../../utility/jscommand");
const TrayPage = require("../../utility/tray.page");
var trayPage = new TrayPage();
const testPage = require("../../utility/login.page");
var loginPage = new testPage();
const TrayUploadhelper = require("../../utility/tray.upload");
var trayUploadhelper = new TrayUploadhelper();
// handle win32 os
if (process.platform === 'win32') {
    electronPath += '.cmd';
}
// init app for testing
var app = new Application({
    path: electronPath,
    args: ["index.js"]
});
var closePtah = electronPath + "/" + "index.js";
global.before(() => {
    chai.should();
    chai.use(chaiAsPromised);
    loginPage.setApp(app);
    trayUploadhelper.setApp(app);
    trayPage.setApp(app);
});
describe("desktop Uploader tray tests", function() {
    this.timeout(60000);
    global.before(() => {
        return app.start();
    });
    global.after((done) => {
        if (app && app.isRunning()) {
            app.mainProcess.pid().then((pid) => {
            process.kill(pid);
                done();
            });
        }
    });
    it('desktop Uploader main window should be visible and checking initial tray text', () => {
        return trayPage.isMainVisible().then((isMinimized) => {
            assert(!isMinimized);
            return trayPage.getInitialSummary().then((summary) => {
                expect(summary).to.equal('No Files Uploaded.');
            });
        });
    });
    it('desktop Uploader minimize main window and restore through tray', () => {
        return trayPage.closeMainPage().then(() => {
            return trayPage.isMainVisible().then((isMinimized) => {
                return trayPage.openMainWindow().then(() => {
                    return trayPage.isMainVisible().then((_isMinimized) => {
                        assert(!_isMinimized);
                    });
                });
            });
        });
    });
    it('Verify stats in tray by Uploading 3 files ==> Success- (1) failed- (1) cancel- (1)', () => {
        return trayPage.getmainWindow().then(() => {
            return loginPage.appLogin().then(() => {
                return trayUploadhelper.selectProject().then(() => {
                    return trayUploadhelper.upLoadfile('1mbword.docx').then(() => {
                        return trayUploadhelper.upLoadfileFail('empty.txt').then(() => {
                            return trayUploadhelper.upLoadgraylistfile('50MbPdf.pdf').then(() => {
                                return trayUploadhelper.cancleProgress().then(() => {
                                    const expectedText = 'Documents Uploaded1 Failed1 Pending0';
                                    return trayPage.getStats().then((title) => {
                                        assert.equal(title, expectedText);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    it('desktop Uploader open URL', () => {
        return trayPage.openOpenUrl().then(() => {
            trayPage.isTrayVisible().then((isFocused) => {
                assert(!isFocused);
            });
        });
    });
    it('desktop QUIT APP', () => {
        app.exitNU = true;
        app.stop();
    });
});

