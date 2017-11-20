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
describe("desktop Uploader Application Regression Tests for Keep Me Login", function () {
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
    it('NU-222 Keep Me login : Verify Login/Logout functionality with - Keep me login checkbox', () => {
        return page.appLoginWithKeepLogin().then(() => {
            return homepage.verifyUserName();
        });
    });
    it('NU-209 Keep Me login :  Verify user should not be login with invalid username and with keep me logged in option', () => {
        return page.appKeepMeLoginInvalidCred('Id').then(() => {
            return page.verifyInvalidCredMessage();
        });
    });
    it('NU-200 Keep Me login :  Verify user should not be login with invalid password and with keep me logged in option', () => {
        return page.appKeepMeLoginInvalidCred('Pwd').then(() => {
            return page.verifyInvalidCredMessage();
        });
    });
    it('NU-204 App Login : Verify user should not be login with email address only with keep me logged in option', () => {
        return page.keepMeloginWithUserNameOnly().then(() => {
                return page.enterPwd('');
        });
    });
    it('NU-205 Keep Me login : Verify user should not be login with password only with keep me logged in option', () => {
        return page.keepMeloginWithUserPwdOnly().then(() => {
            return page.enterPwd('');
        });
    });
});
