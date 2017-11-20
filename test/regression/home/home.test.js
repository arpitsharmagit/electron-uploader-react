var Application = require('spectron').Application;
var assert = require('assert');
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
var electronPath = `${__dirname}/../../../node_modules/.bin/electron`;
var commands = require("../../utility/jscommand");

const testPage = require("../../utility/login.page");
var page = new testPage();
const homePage = require("../../utility/home.page");
var homepage = new homePage();

const testkeys = require('../../utility/teststatekeys');
const selectors = require('../../utility/selectors');

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
    page.setApp(app);
    homepage.setApp(app);
});
describe("desktop Uploader Application Regression Tests for home page", function () {
    this.timeout(100000);
    beforeEach(() => {
        return app.start();
    });
    afterEach((done) => {
        if (app && app.isRunning()) {
            app.mainProcess.pid().then((pid) => {
                process.kill(pid);
                done();
            });
        }
    });

    it('NU-179 desktop Uploader : Verify Home Page UI', () => {
        return page.appLogin().then(() => {
            return homepage.toVerifySelectProjectUI().then(() => {
                return homepage.setTimeOut(7000).then(() => {
                    return homepage.toVerifyMenuUI().then(() => {
                        return homepage.toVerifyChooseAProjectLabel().then(() => {
                            return homepage.toVerifyQuickdropUI();
                        });
                    });
                });
            });
        });
    });


    it('NU-163 Notification Toaster : Verify Notification Toaster- Success Message', () => {
        return page.appLogin().then(() => {
            return homepage.selectProjectWithParameter(testkeys.projectName).then(() => {
                return homepage.upLoadfile('1mbword.docx').then(() => {
                        return homepage.NotificationToasterSuccess();
                });
            });
        });
    });

    it('NU-164 Notification Toaster : Verify failed Message for failed file upload', () => {
        return page.appLogin().then(() => {
            return homepage.selectProjectWithParameter(testkeys.projectName).then(() => {
                return homepage.upLoadfailedfile('empty.txt').then(() => {
                    return homepage.NotificationToasterFailedMessage();
                });
            });
        });
    });
    it('NU-180 Project Drop-down : Verify Behavior of project drop-down', () => {
        return page.appLogin().then(() => {
            return homepage.selectProjectWithParameter(testkeys.projectName).then(() => {
                return homepage.checkTabCount(testkeys.defaultTabCount);
            });
        });
    });

    it('NU-211:desktop Uploader Upload statistics : Verify Behaviour of state of uploads by switching to another tabs within same project', () => {
        return page.appLogin().then(() => {
            return homepage.selectProjectWithParameter(testkeys.projectName).then(() => {
                return homepage.upLoadfileWithParameter('1mbword.docx').then(() => {
                    return homepage.fileUploadMessage(testkeys.successfullyUploaded).then(() => {
                        return homepage.checkTabCount(testkeys.tabCountUpload1Failed0Successful1Cancel0).then(() => {
                            return homepage.ChangeUploadsTab(selectors.failedUploadsSelector, testkeys.failedTabName).then(() => {
                                return homepage.ChangeUploadsTab(selectors.successfulUploadsSelector, testkeys.successfulTabName).then(() => {
                                    return homepage.ChangeUploadsTab(selectors.cancelUploadsSelector, testkeys.cancelTabName);
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it('NU-181:desktop Uploader Upload statistics : Verify Behaviour of state of  uploads by switching to another project', () => {
        return page.appLogin().then(() => {
            return homepage.selectProjectWithParameter(testkeys.projectName).then(() => {
                return homepage.checkTabCount(testkeys.defaultTabCount).then(() => {
                    return homepage.selectProjectWithParameter(testkeys.projectName2).then(() => {
                        return homepage.upLoadfileWithParameter('1mbword.docx').then(() => {
                            return homepage.fileUploadMessage(testkeys.successfullyUploaded).then(() => {
                                return homepage.checkTabCount(testkeys.oneSuccTabCount).then(() => {
                                    return homepage.selectProject(testkeys.projectName).then(() => {
                                        return homepage.checkTabCount(testkeys.defaultTabCount);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
