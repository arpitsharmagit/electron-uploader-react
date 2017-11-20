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
describe("desktop Uploader Application Regression Tests for Clear List", function () {
    this.timeout(60000);
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
    it('NU-170 Clear Functionality: Verify Clear Cancel upload List Functionality', () => {
        return page.appLogin().then(() => {
            return homepage.selectProject().then(() => {
                return homepage.checkDefaultTabCount().then(() => {
                    return homepage.cancleupLoadfile('50MbPdf.pdf').then(() => {
                        return homepage.cancleProgress().then(() => {
                            return homepage.clearListWithOptions('Cancle').then(() => {
                                return homepage.verifyLogOut();
                            });
                        });
                    });
                });
            });
        });
    });
    it('NU-171 Clear Functionality : Verify Clear List Functionality When no files Uploaded', () => {
        return page.appLogin().then(() => {
            return homepage.selectProject().then(() => {
                return homepage.checkDefaultTabCount().then(() => {
                    return homepage.clearListWithOptions('All').then(() => {
                        return homepage.clearListWithOptions('Successfull').then(() => {
                            return homepage.clearListWithOptions('Cancle').then(() => {
                                return homepage.clearListWithOptions('Failed').then(() => {
                                    return homepage.verifyLogOut();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    it('NU-167: Clear Functionality: Verify Clear All Upload List', () => {
        return page.appLogin().then(() => {
            return homepage.selectProjectWithParameter(testkeys.projectName).then(() => {
                return homepage.checkTabCount(testkeys.defaultTabCount).then(() => {
                    return homepage.upLoadfileWithParameter('1mbword.docx').then(() => {
                        return homepage.setTimeOut(7000).then(() => {
                            return homepage.clearListAllUploadList("All");
                        });
                    });
                });
            });
        });
    });
    it('NU-168 Clear Functionality: Verify Clear Successful Upload List', () => {
        return page.appLogin().then(() => {
            return homepage.selectProjectWithParameter(testkeys.projectName).then(() => {
                return homepage.checkTabCount(testkeys.defaultTabCount).then(() => {
                    return homepage.upLoadfileWithParameter('1mbword.docx').then(() => {
                        return homepage.setTimeOut(7000).then(() => {
                            return homepage.clearListAllUploadList("Successfull");
                        });
                    });
                });
            });
        });
    });
    it.only('NU-169 Clear Functionality: Verify Clear Failed Upload List', () => {
        return page.appLogin().then(() => {
            return homepage.selectProjectWithParameter(testkeys.projectName).then(() => {
                return homepage.checkTabCount(testkeys.defaultTabCount).then(() => {
                    return homepage.upLoadfileWithParameter('empty.txt').then(() => {
                        return homepage.setTimeOut(7000).then(() => {
                            return homepage.clearListAllUploadList("Failed");
                        });
                    });
                });
            });
        });
    });
});