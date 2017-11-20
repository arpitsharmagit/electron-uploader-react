var Application = require('spectron').Application;
var assert = require('assert');
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
var electronPath = `${__dirname}/../../node_modules/.bin/electron`;
var commands = require("../utility/jscommand");

const testPage = require("../utility/login.page");
var page = new testPage();
const homePage = require("../utility/home.page");
var homepage = new homePage();

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
})
describe("desktop Uploader Application Smoke Tests", function () {
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
    it('NU-199 Verify desktop Uploader starts and visible with single instance', function () {
        return page.getWindowCount().should.eventually.equal(page.windowCount + 1).then(function () {
            return page.getApplicationTitle().should.eventually.equal(page.pageTitle);
        });
    });
    it('desktop Uploader Verify Login functionality with valid credential', () => {
        return page.appLogin().then(() => {
            return homepage.verifyUserName();
        });
    });
    it('desktop Uploader Verify Sign Out Functionality', () => {
        return page.appLogin().then(() => {
            return homepage.verifyLogOut();
        });
    });
    it('desktop Uploader Verify Upload file Functionality', () => {
        return page.appLogin().then(() => {
            return homepage.selectProject().then(() => {
                return homepage.upLoadfile('1mbword.docx');
            });
        });
    });
});
