var Application = require('spectron').Application;
var assert = require('assert');
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
var electronPath = `${__dirname}/../../../node_modules/.bin/electron`;

var commands = require("../../utility/treeDropCommand");
const LoginPage = require("../../utility/login.page");
var loginPage = new LoginPage();
const HomePage = require("../../utility/home.page");
var homePage = new HomePage();

// handle win32 os
if (process.platform === 'win32') {
    electronPath += '.cmd';
}
// init app for testing
var app = new Application({
    path: electronPath,
    args: ["index.js"]
});
var client;

global.before(() => {
    chai.should();
    chai.use(chaiAsPromised);
    loginPage.setApp(app);
    homePage.setApp(app);
});
describe("Regression Tests for TreeDrop", function () {
    this.timeout(60000);
    beforeEach(() => {
        return app.start().then(() => {
            client = app.client;
            return;
        });
    });
    afterEach((done) => {
        if (app && app.isRunning()) {
            app.mainProcess.pid().then((pid) => {
                process.kill(pid);
                done();
            });
        }
    });
    it('NU-234 Tree View : Verify folder hierarchy with drag and drop upload option', () => {
        var testFolderPath = path.resolve(__dirname, "../../test-data/Root").replace(/\\/g, "/");
        return loginPage.appLogin().then(() => {
            return client.pause(7000)
                .waitForEnabled('#dropdown-project', 7000, false)
                .click('#dropdown-project')
                .click('//*[@id="root"]/div/div[1]/div[1]/div/ul/li[2]/a')
                .pause(2000)
                .click("#locationSwitch")
                .waitForVisible('//*[@id="root"]/div/div[1]/div[2]/div/ul/li[2]/a')
                .click('//*[@id="root"]/div/div[1]/div[2]/div/ul/li[2]/a')
                .pause(2000)
                .waitForVisible('//*[@id="main-tab-pane-1"]/div/div[2]/div')
                .click('//*[@id="main-tab-pane-1"]/div/div[2]/div/ul/li/div/a')
                .then(() => {
                    return commands.DropCommand(testFolderPath, "#main-tab-pane-1 div.node").then((command) => {
                        return client.webContents.executeJavaScript(command).then(() => {
                            return client.pause(10000)
                                .click('//*[@id="main-tab-tab-2"]')
                                .pause(2000)
                                .isExisting('//*[@id="main-tab-pane-2"]/div/div/div[3]/div[2]/div/span/i[1]')
                                .then((exists) => {
                                    assert.equal(exists, true);
                                    return app.client;
                                });
                        });
                    });
                }).pause(5000);
        });
    });
    it('NU-235 Tree View : Verify folder hierarchy with browse upload option', () => {
        return loginPage.appLogin().then(() => {
            return client.pause(7000)
                .waitForEnabled('#dropdown-project', 5000, false)
                .click('#dropdown-project')
                .click('//*[@id="root"]/div/div[1]/div[1]/div/ul/li[2]/a')
                .pause(2000)
                .click("#locationSwitch")
                .waitForVisible('//*[@id="root"]/div/div[1]/div[2]/div/ul/li[2]/a')
                .click('//*[@id="root"]/div/div[1]/div[2]/div/ul/li[2]/a')
                .pause(2000)
                .waitForVisible('//*[@id="main-tab-pane-1"]/div/div[2]/div')
                .click('//*[@id="main-tab-pane-1"]/div/div[2]/div/ul/li/div/a')
                .click('//*[@id="main-tab-pane-1"]/div/div[2]/div/ul/li/div/span/span')
                .pause(1000)
                .waitForText('//*[@id="main-tab-pane-1"]/div/div[1]/p/span', 2000)
                .getText('//*[@id="main-tab-pane-1"]/div/div[1]/p/span')
                .then((text) => {
                    assert.equal(text, 'Browse');
                    return app.client;
                }).pause(5000);
        });
    });
    it('NU-236 Tree View : Verify folder single file upload with my folders upload option', () => {
        var testFilePath = path.resolve(__dirname, "../../test-data/TestDoc.docx").replace(/\\/g, "/");
        return loginPage.appLogin().then(() => {
            return client.pause(7000)
                .waitForEnabled('#dropdown-project', 7000, false)
                .click('#dropdown-project')
                .click('//*[@id="root"]/div/div[1]/div[1]/div/ul/li[2]/a')
                .pause(2000)
                .click("#locationSwitch")
                .waitForVisible('//*[@id="root"]/div/div[1]/div[2]/div/ul/li[2]/a')
                .click('//*[@id="root"]/div/div[1]/div[2]/div/ul/li[2]/a')
                .pause(2000)
                .waitForVisible('//*[@id="main-tab-pane-1"]/div/div[2]/div')
                .click('//*[@id="main-tab-pane-1"]/div/div[2]/div/ul/li/div/a')
                .then(() => {
                    return commands.DropCommand(testFilePath, "#main-tab-pane-1 div.node").then((command) => {
                        return client.webContents.executeJavaScript(command).then(() => {
                            return app.client.pause(5000)
                                .click('//*[@id="main-tab-tab-2"]')
                                .waitUntilTextExists('//*[@id="main-tab-pane-2"]/div/div/div[2]/div/div/div[1]/p/span[2]', '/ Successfully Uploaded', 2000)
                                .getText('//*[@id="main-tab-pane-2"]/div/div/div[2]/div/div/div[1]/p/span[2]')
                                .then((title) => {
                                    assert.equal(title, '/ Successfully Uploaded');
                                    return app.client;
                                });
                        });
                    });
                }).pause(5000);
        });
    });
    it('NU-237 Tree View : Verify folder single file upload clear List functionality with my folders upload option', () => {
        var testFilePath = path.resolve(__dirname, "../../test-data/TestDoc.docx").replace(/\\/g, "/");
        return loginPage.appLogin().then(() => {
            return client.pause(7000)
                .waitForEnabled('#dropdown-project', 7000, false)
                .click('#dropdown-project')
                .click('//*[@id="root"]/div/div[1]/div[1]/div/ul/li[2]/a')
                .pause(2000)
                .click("#locationSwitch")
                .waitForVisible('//*[@id="root"]/div/div[1]/div[2]/div/ul/li[2]/a')
                .click('//*[@id="root"]/div/div[1]/div[2]/div/ul/li[2]/a')
                .pause(2000)
                .waitForVisible('//*[@id="main-tab-pane-1"]/div/div[2]/div')
                .click('//*[@id="main-tab-pane-1"]/div/div[2]/div/ul/li/div/a')
                .then(() => {
                    return commands.DropCommand(testFilePath, "#main-tab-pane-1 div.node").then((command) => {
                        return client.webContents.executeJavaScript(command).then(() => {
                            return app.client.pause(10000)
                                .click('//*[@id="main-tab-tab-2"]')
                                .waitUntilTextExists('#main-tab-pane-2 > div > div > div.rootFiles > div > div > div.uploaderFolder > p > span:nth-child(2)', '/ Successfully Uploaded', 10000);
                        });
                    });
                })
                .then(() => {
                    app.client
                        .click('//*[@id="main-tab-tab-2"]')
                        .click('//*[@id="clearList"]')
                        .click('//*[@id="root"]/div/div[2]/div/ul/li[2]/a')
                        .pause(1000)
                        .waitUntilTextExists('//*[@id="uploads-tab"]/li[1]/a/span/span', '0', 1000)
                        .then((count) => {
                            assert.equal(count, '0');
                            return app.client;
                        })
                        .waitUntilTextExists('//*[@id="uploads-tab"]/li[3]/a/span/span', '0', 1000)
                        .then((count) => {
                            assert.equal(count, '0');
                            return app.client;
                        }).pause(5000);
                });
        });
    });
    it('NU-238 Tree View : Verify folder upload clear All List functionality with my folders upload option', () => {
        var testFilePath = path.resolve(__dirname, "../../test-data/TestDoc.docx").replace(/\\/g, "/");
        return loginPage.appLogin().then(() => {
            return client.pause(7000)
                .waitForEnabled('#dropdown-project', 7000, false)
                .click('#dropdown-project')
                .click('//*[@id="root"]/div/div[1]/div[1]/div/ul/li[2]/a')
                .pause(2000)
                .click("#locationSwitch")
                .waitForVisible('//*[@id="root"]/div/div[1]/div[2]/div/ul/li[2]/a')
                .click('//*[@id="root"]/div/div[1]/div[2]/div/ul/li[2]/a')
                .pause(2000)
                .waitForVisible('//*[@id="main-tab-pane-1"]/div/div[2]/div')
                .click('//*[@id="main-tab-pane-1"]/div/div[2]/div/ul/li/div/a')
                .then(() => {
                    return commands.DropCommand(testFilePath, "#main-tab-pane-1 div.node").then((command) => {
                        return client.webContents.executeJavaScript(command).then(() => {
                            return app.client.pause(10000)
                                .click('//*[@id="main-tab-tab-2"]')
                                .pause(2000)
                                .getText('//*[@id="main-tab-pane-2"]/div/div/div[2]/div/div/div[1]/p/span[2]')
                                .then((title) => {
                                    assert.equal(title, '/ Successfully Uploaded');
                                    return app.client;
                                });
                        });
                    });
                })
                .pause(5000)
                .click('//*[@id="main-tab-tab-2"]')
                .click('//*[@id="clearList"]')
                .click('//*[@id="root"]/div/div[2]/div/ul/li[1]/a')
                .pause(2000)
                .waitUntilTextExists('//*[@id="uploads-tab"]/li[1]/a/span/span', '0', 1000)
                .getText('//*[@id="uploads-tab"]/li[1]/a/span/span')
                .then((count) => {
                    assert.equal(count, '0');
                    return app.client;
                })
                .waitUntilTextExists('//*[@id="uploads-tab"]/li[2]/a/span/span', '0', 1000)
                .getText('//*[@id="uploads-tab"]/li[2]/a/span/span')
                .then((count) => {
                    assert.equal(count, '0');
                    return app.client;
                })
                .waitUntilTextExists('//*[@id="uploads-tab"]/li[3]/a/span/span', '0', 1000)
                .getText('//*[@id="uploads-tab"]/li[3]/a/span/span')
                .then((count) => {
                    assert.equal(count, '0');
                    return app.client;
                })
                .waitUntilTextExists('//*[@id="uploads-tab"]/li[4]/a/span/span', '0', 1000)
                .getText('//*[@id="uploads-tab"]/li[4]/a/span/span')
                .then((count) => {
                    assert.equal(count, '0');
                    return app.client;
                }).pause(5000);
        });
    });
    it('NU-239 Tree View : Verify folder upload clear Successful List functionality with my folders upload option', () => {
        var testFilePath = path.resolve(__dirname, "../../test-data/TestDoc.docx").replace(/\\/g, "/");
        return loginPage.appLogin().then(() => {
            return client.pause(7000)
                .waitForEnabled('#dropdown-project', 7000, false)
                .click('#dropdown-project')
                .click('//*[@id="root"]/div/div[1]/div[1]/div/ul/li[2]/a')
                .pause(2000)
                .click("#locationSwitch")
                .waitForVisible('//*[@id="root"]/div/div[1]/div[2]/div/ul/li[2]/a')
                .click('//*[@id="root"]/div/div[1]/div[2]/div/ul/li[2]/a')
                .pause(2000)
                .waitForVisible('//*[@id="main-tab-pane-1"]/div/div[2]/div')
                .click('//*[@id="main-tab-pane-1"]/div/div[2]/div/ul/li/div/a')
                .then(() => {
                    return commands.DropCommand(testFilePath, "#main-tab-pane-1 div.node").then((command) => {
                        return client.webContents.executeJavaScript(command).then(() => {
                            return app.client.pause(10000)
                                .click('//*[@id="main-tab-tab-2"]')
                                .waitUntilTextExists('#main-tab-pane-2 > div > div > div.rootFiles > div > div > div.uploaderFolder > p > span:nth-child(2)', '/ Successfully Uploaded', 10000);
                        });
                    });
                })
                .then(() => {
                    app.client
                        .click('//*[@id="main-tab-tab-2"]')
                        .click('//*[@id="clearList"]')
                        .click('//*[@id="root"]/div/div[2]/div/ul/li[1]/a')
                        .pause(1000)
                        .waitUntilTextExists('//*[@id="main-tab-pane-2"]/div/div/div[1]', '', 1000)
                        .then((noroot) => {
                            assert.equal(noroot, '0');
                            return app.client;
                        })
                        .waitUntilTextExists('//*[@id="main-tab-pane-2"]/div/div/div[2]', '', 1000)
                        .then((nofiles) => {
                            assert.equal(nofiles, '0');
                            return app.client;
                        });
                }).pause(5000);
        });
    });
    it('NU-240 Tree View : Verify folder upload clear Failed upload List functionality with my folders upload option', () => {
        var testFilePath = path.resolve(__dirname, "../../test-data/empty.txt").replace(/\\/g, "/");
        return loginPage.appLogin().then(() => {
            return client.pause(7000)
                .waitForEnabled('#dropdown-project', 7000, false)
                .click('#dropdown-project')
                .click('//*[@id="root"]/div/div[1]/div[1]/div/ul/li[2]/a')
                .pause(2000)
                .click("#locationSwitch")
                .waitForVisible('//*[@id="root"]/div/div[1]/div[2]/div/ul/li[2]/a')
                .click('//*[@id="root"]/div/div[1]/div[2]/div/ul/li[2]/a')
                .pause(2000)
                .waitForVisible('//*[@id="main-tab-pane-1"]/div/div[2]/div')
                .click('//*[@id="main-tab-pane-1"]/div/div[2]/div/ul/li/div/a')
                .then(() => {
                    return commands.DropCommand(testFilePath, "#main-tab-pane-1 div.node").then((command) => {
                        return client.webContents.executeJavaScript(command).then(() => {
                            return app.client.pause(10000)
                                .click('//*[@id="main-tab-tab-2"]')
                                .pause(2000)
                                .getText('//*[@id="main-tab-pane-2"]/div/div/div[2]/div/div/div[1]/p/span[2]')
                                .then((title) => {
                                    assert.equal(title, '/ Upload Failed. VIRUS_DETECTED');
                                    return app.client;
                                });
                        });
                    });
                })
                .pause(5000)
                .click('//*[@id="main-tab-tab-2"]')
                .click('//*[@id="clearList"]')
                .click('//*[@id="root"]/div/div[2]/div/ul/li[3]/a')
                .pause(2000)
                .waitUntilTextExists('//*[@id="uploads-tab"]/li[1]/a/span/span', '0', 1000)
                .getText('//*[@id="uploads-tab"]/li[1]/a/span/span')
                .then((count) => {
                    assert.equal(count, '0');
                    return app.client;
                })
                .waitUntilTextExists('//*[@id="uploads-tab"]/li[2]/a/span/span', '0', 1000)
                .getText('//*[@id="uploads-tab"]/li[2]/a/span/span')
                .then((count) => {
                    assert.equal(count, '0');
                    return app.client;
                })
                .waitUntilTextExists('//*[@id="uploads-tab"]/li[3]/a/span/span', '0', 1000)
                .getText('//*[@id="uploads-tab"]/li[3]/a/span/span')
                .then((count) => {
                    assert.equal(count, '0');
                    return app.client;
                });
        });
    });
    it('NU-241 Tree View : Verify file upload clear cancel upload List functionality with my folders upload option', () => {
        var testFolderPath = path.resolve(__dirname, "../../test-data/50Mbpdf.pdf").replace(/\\/g, "/");
        return loginPage.appLogin().then(() => {
            return client.pause(7000)
                .waitForEnabled('#dropdown-project', 7000, false)
                .click('#dropdown-project')
                .click('//*[@id="root"]/div/div[1]/div[1]/div/ul/li[2]/a')
                .pause(2000)
                .click("#locationSwitch")
                .waitForVisible('//*[@id="root"]/div/div[1]/div[2]/div/ul/li[2]/a')
                .click('//*[@id="root"]/div/div[1]/div[2]/div/ul/li[2]/a')
                .pause(2000)
                .waitForVisible('//*[@id="main-tab-pane-1"]/div/div[2]/div')
                .click('//*[@id="main-tab-pane-1"]/div/div[2]/div/ul/li/div/a')
                .then(() => {
                    return commands.DropCommand(testFolderPath, "#main-tab-pane-1 div.node").then((command) => {
                        return client.webContents.executeJavaScript(command).then(() => {
                            return app.client.pause(2000)
                                .click('//*[@id="main-tab-tab-2"]')
                                .pause(1000)
                                .click('//*[@id="main-tab-pane-2"]/div/div/div[2]/div/button')
                                .waitUntilTextExists('//*[@id="uploads-tab"]/li[4]/a/span/span', '1', 1000);
                        });
                    });
                })
                .pause(2000)
                .click('//*[@id="clearList"]')
                .click('//*[@id="root"]/div/div[2]/div/ul/li[4]/a')
                .pause(2000)
                .waitUntilTextExists('//*[@id="uploads-tab"]/li[1]/a/span/span', '0', 1000)
                .getText('//*[@id="uploads-tab"]/li[1]/a/span/span')
                .then((count) => {
                    assert.equal(count, '0');
                    return app.client;
                })
                .waitUntilTextExists('//*[@id="uploads-tab"]/li[4]/a/span/span', '0', 1000)
                .getText('//*[@id="uploads-tab"]/li[4]/a/span/span')
                .then((count) => {
                    return assert.equal(count, '0');
                });
        });
    });
});
