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
});
describe("desktop Uploader Application Regression Tests for App Login ", function () {
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
    it.only('NU-141 App Login : Verify login functionality with valid credential', () => {
        return page.appLogin().then(() => {
            return homepage.verifyUserName();
        });
    });
    it('NU-207 App Login : Verify login with invalid credential', () => {
        return page.appLoginInvalidCred('Id').then(() => {
            return page.verifyInvalidCredMessage().then(() => {
                return page.appLoginInvalidCred('Pwd').then(() => {
                    return page.verifyInvalidCredMessage();
                });
            });
        });
    });
    it('NU:143 App Login : Verify logout/signout with valid credential', () => {
        return page.appLogin().then(() => {
            return homepage.verifyLogOut();
        });
    });
    it('NU:200 App Login : Verify user should not be login with email address/Password only', () => {
        return page.loginWithUserNameOnly().then(() => {
            return page.loginWithUserPwdOnly();
        });
    });
    it('NU-206 App Login : Verify login with valid username without case sensitivity', () => {
        return page.appCaseSensitiveLogin().then(() => {
            return homepage.verifyLogOut().then(() => {
                return page.appCaseSensitiveCapsLogin().then(() => {
                    return homepage.verifyLogOut();
                });
            });
        });
    });
    it('NU-208 App Login : Verify login with SQL Injection attempt', () => {
        return page.appLoginSqlInjection().then(() => {
            return page.verifyInvalidCredMessage();
        });
    });
});
