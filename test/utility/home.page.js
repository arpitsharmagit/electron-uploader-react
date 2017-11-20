const testkeys = require('./teststatekeys');
const selectors = require('./selectors');

var HomePage = function () {
    var commands = require("../utility/jscommand");
    var assert = require('assert');
    var app;
    this.projectName = 'a=BEST OF LONDON';
    this.userName = 'Ronnie Walker';


    this.setApp = (app_n) => {
        this.app = app_n;
    };
    this.selectProject = () => {
        return this.app.client.pause(7000).then(() => {
            return this.app.client.waitForVisible('#dropdown-project').then(() => {
                return this.app.client.waitForEnabled('#dropdown-project', 99999, false).click('#dropdown-project').then(() => {
                    return this.app.client.waitForVisible('#root > div > div.topbar > div.projectlist > div > ul > li:nth-child(2) > a').then(() => {
                        return this.app.client.click(this.projectName);
                    });
                });
            });
        });
    };

    this.selectProjectWithParameter = (prjName) => {
        return this.app.client.pause(7000).then(() => {
            return this.app.client.waitForVisible('#dropdown-project').then(() => {
                return this.app.client.waitForEnabled('#dropdown-project', 99999, false).click('#dropdown-project').then(() => {
                    return this.app.client.waitForVisible('#root > div > div.topbar > div.projectlist > div > ul > li:nth-child(2) > a').then(() => {
                        return this.app.client.click(prjName);
                    });
                });
            });
        });
    };

    this.verifyUserName = () => {
        return this.app.client.pause(10000).then(() => {
            return this.app.client.waitForVisible('#root > div > div.topbar > div.seting-menu > div > div').then(() => {
                return this.app.client.click('#dropdown-no-caret').then(() => {
                    return this.app.client.waitUntilTextExists('#root > div > div.topbar > div.seting-menu > div > div > ul > li:nth-child(1) > a', testkeys.userName
                    , 10000).then(() => {
                        return this.app.client.getText('#root > div > div.topbar > div.seting-menu > div > div > ul > li:nth-child(1) > a').should.eventually.equal(this.userName).then(function (text) {
                        });
                    });
                });
            });
        });
    };
    this.verifyLogOut = () => {
        return this.app.client.pause(7000).then(() => {
            return this.app.client.waitForVisible('#root > div > div.topbar > div.seting-menu > div > div').then(() => {
                return this.app.client.click('#dropdown-no-caret').then(() => {
                    return this.app.client.waitUntilTextExists('#root > div > div.topbar > div.seting-menu > div > div > ul > li:nth-child(1) > a', this.userName, 10000).then(() => {
                        return this.app.client.click('=Sign Out').then(() => {
                            return this.app.client.waitUntilWindowLoaded()
                                .getText('button[type="submit"]').should.eventually.equal('Sign In');
                        });
                    });
                });
            });
        });
    };

    this.checkDefaultTabCount = () => {
        return this.app.client.pause(3000).then(() => {
            return this.app.client.waitForVisible('#main-tab-tab-2 > strong').then(() => {
                return this.app.client.click('#main-tab-tab-2 > strong').then(() => {
                    return this.app.client.click('#main-tab-tab-2 > strong').then(() => {
                        return this.app.client.getText('#uploads-tab').then((title) => {
                            return this.app.client.pause(3000).then(() => {
                                if (title === 'All Uploads 0\n\Failed Uploads 0\n\Successful Uploads 0\n\Cancelled Uploads 0') {
                                    console.log('if');
                                    assert.equal(title, 'All Uploads 0\n\Failed Uploads 0\n\Successful Uploads 0\n\Cancelled Uploads 0');
                                }
                                else {
                                    assert.equal(title, '');
                                }
                            });
                        });
                    });
                });
            });
        });
    };

    this.checkTabCount = (tabCount) => {
        return this.app.client.pause(5000).then(() => {
            return this.app.client.waitForVisible('#main-tab-tab-2 > strong').then(() => {
                return this.app.client.click('#main-tab-tab-2 > strong').then(() => {
                    return this.app.client.click('#main-tab-tab-2 > strong').then(() => {
                        return this.app.client.pause(5000).getText('#uploads-tab').then((title) => {
                            assert.equal(title, tabCount);
                        });
                    });
                });
            });
        });
    };

    this.checkDefaultTabCountWithzero = () => {
        return this.app.client.pause(3000).then(() => {
            return this.app.client.waitForVisible('#main-tab-tab-2 > strong').then(() => {
                return this.app.client.click('#main-tab-tab-2 > strong').then(() => {
                    return this.app.client.click('#main-tab-tab-2 > strong').then(() => {
                        return this.app.client.getText('#uploads-tab').then((title) => {
                            return this.app.client.pause(3000).then(() => {
                                assert.equal(title, 'All Uploads 0\n\Failed Uploads 0\n\Successful Uploads 0\n\Cancelled Uploads 0');
                                // assert.equal(title, '');
                            });
                        });
                    });
                });
            });
        });
    };

    this.upLoadfile = (filename) => {
        return this.app.client.waitForVisible('#main-tab-tab-1 > strong').then(() => {
            return this.app.client.click('#main-tab-tab-1 > strong').then(() => {
                return this.app.client.waitForVisible('#dropBasket').then(() => {
                    return this.app.client.then(() => {
                        return this.app.client.webContents.executeJavaScript(
                            commands.getDropCommand(filename), true, function (done, result) {
                            }).then(() => {
                                return this.app.client.pause(2000).then(() => {
                                    return this.app.client.click('#main-tab-tab-2 > strong').then(() => {
                                        return this.app.client.click('#main-tab-tab-2 > strong').then(() => {
                                            return this.app.client.waitUntilTextExists('#main-tab-pane-2 > div > div > div.rootFiles > div > div > div.uploaderFolder > p > span:nth-child(2)', '/ Successfully Uploaded', 10000).then((title) => {
                                                // assert.equal(title, '/ Successfully Uploaded');
                                            });
                                        });
                                    });
                                });
                            });
                    });
                });
            });
        });
    };
    this.cancleupLoadfile = (filename) => {
        return this.app.client.waitForVisible('#main-tab-tab-1 > strong').then(() => {
            return this.app.client.click('#main-tab-tab-1 > strong').then(() => {
                return this.app.client.waitForVisible('#dropBasket').then(() => {
                    return this.app.client.then(() => {
                        return this.app.client.webContents.executeJavaScript(
                            commands.getDropCommand(filename), true, function (done, result) {
                            }).then(() => {
                                return this.app.client.pause(2000).then(() => {
                                    return this.app.client.click('#main-tab-tab-2 > strong').then(() => {
                                        return this.app.client.click('#main-tab-tab-2 > strong').then(() => {
                                            return this.app.client.getText('#main-tab-pane-2 > div > div > div.rootFiles > div > div > div.uploaderFolder > p > span:nth-child(2)', '/ 10 MB of 49 MB', 10000).then((title) => {
                                                // assert.equal(title, '/ Successfully Uploaded');
                                            });
                                        });
                                    });
                                });
                            });
                    });
                });
            });
        });
    };

    this.upLoadgraylistfile = (filename) => {
        return this.app.client.waitForVisible('#main-tab-tab-1 > strong').then(() => {
            return this.app.client.click('#main-tab-tab-1 > strong').then(() => {
                return this.app.client.waitForVisible('#dropBasket').then(() => {
                    return this.app.client.then(() => {
                        return this.app.client.webContents.executeJavaScript(
                            commands.getDropCommand(filename), true, function (done, result) {
                            }).then(() => {
                                return this.app.client.pause(2000).then(() => {
                                    return this.app.client.click('#main-tab-tab-2 > strong').then(() => {
                                        return this.app.client.click('#main-tab-tab-2 > strong').then(() => {
                                            return this.app.client.getText('#main-tab-pane-2 > div > div > div.rootFiles > div > div > div.uploaderFolder > p > span:nth-child(2)', '/ 10 MB of 49 MB', 10000).then((title) => {
                                                // assert.equal(title, '/ Successfully Uploaded');
                                            });
                                        });
                                    });
                                });
                            });
                    });
                });
            });
        });
    };
    this.upLoadfailedfile = (filename) => {
        return this.app.client.waitForVisible('#main-tab-tab-1 > strong').then(() => {
            return this.app.client.click('#main-tab-tab-1 > strong').then(() => {
                return this.app.client.waitForVisible('#dropBasket').then(() => {
                    return this.app.client.then(() => {
                        return this.app.client.webContents.executeJavaScript(
                            commands.getDropCommand(filename), true, function (done, result) {
                            }).then(() => {
                                return this.app.client.pause(2000).then(() => {
                                    return this.app.client.click('#main-tab-tab-2 > strong').then(() => {
                                        return this.app.client.click('#main-tab-tab-2 > strong').then(() => {
                                            return this.app.client.getText('#main-tab-pane-2 > div > div > div.rootFiles > div > div > div.uploaderFolder > p > span:nth-child(2)', '/ Upload Failed. VIRUS_DETECTED', 10000).then((title) => {
                                                // assert.equal(title, '/ Successfully Uploaded');
                                            });
                                        });
                                    });
                                });
                            });
                    });
                });
            });
        });
    };

    this.clearListAllUploadList = () => {
        return this.app.client.getText('#root > div > div.clearlist-container > div > ul > li:nth-child(1) > a > strong').then(() => {
            return this.app.client.waitForVisible('#clearList').then(() => {
                return this.app.client.click('#clearList').then(() => {
                    return this.app.client.waitForVisible('#root > div > div.clearlist-container > div > ul > li:nth-child(1) > a > strong').then(() => {
                        return this.app.client.click('#root > div > div.clearlist-container > div > ul > li:nth-child(1) > a > strong').then(() => {
                            return this.app.client.pause(3000).then(() => {
                                return this.app.client.getText('#uploads-tab').then((title) => {
                                    assert.equal(title, 'All Uploads 0\n\Failed Uploads 0\n\Successful Uploads 0\n\Cancelled Uploads 0');
                                });
                            });
                        });
                    });
                });
            });
        });
    };
    this.Verifystats = (stats) => {
        return this.app.client.getText('#uploads-tab').then((title) => {
            assert.equal(title, stats);
        });
    };


    this.clearListWithOptions = (option) => {
        switch (option) {
            case "All":
                return this.app.client.getText('#root > div > div.clearlist-container > div > ul > li:nth-child(1) > a > strong').then(() => {
                    return this.app.client.waitForVisible('#clearList').then(() => {
                        return this.app.client.click('#clearList').then(() => {
                            return this.app.client.waitForVisible('#root > div > div.clearlist-container > div > ul > li:nth-child(1) > a > strong').then(() => {
                                return this.app.client.click('#root > div > div.clearlist-container > div > ul > li:nth-child(1) > a > strong').then(() => {
                                    return this.app.client.pause(3000).then(() => {
                                        return this.app.client.getText('#uploads-tab').then((title) => {
                                            assert.equal(title, 'All Uploads 0\n\Failed Uploads 0\n\Successful Uploads 0\n\Cancelled Uploads 0');
                                        });
                                    });
                                });
                            });
                        });
                    });
                });

            case "Successfull":
                return this.app.client.getText('#root > div > div.clearlist-container > div > ul > li:nth-child(1) > a > strong').then(() => {
                    return this.app.client.waitForVisible('#clearList').then(() => {
                        return this.app.client.click('#clearList').then(() => {
                            return this.app.client.waitForVisible('#root > div > div.clearlist-container > div > ul > li:nth-child(2) > a > strong').then(() => {
                                return this.app.client.click('#root > div > div.clearlist-container > div > ul > li:nth-child(2) > a > strong').then(() => {
                                    return this.app.client.pause(3000).then(() => {
                                        return this.app.client.getText('#uploads-tab').then((title) => {
                                            assert.equal(title, 'All Uploads 0\n\Failed Uploads 0\n\Successful Uploads 0\n\Cancelled Uploads 0');
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            case "Failed":
                return this.app.client.getText('#root > div > div.clearlist-container > div > ul > li:nth-child(1) > a > strong').then(() => {
                    return this.app.client.waitForVisible('#clearList').then(() => {
                        return this.app.client.click('#clearList').then(() => {
                            return this.app.client.waitForVisible('#root > div > div.clearlist-container > div > ul > li:nth-child(3) > a > strong').then(() => {
                                return this.app.client.click('#root > div > div.clearlist-container > div > ul > li:nth-child(3) > a > strong').then(() => {
                                    return this.app.client.pause(3000).then(() => {
                                        return this.app.client.getText('#uploads-tab').then((title) => {
                                            assert.equal(title, 'All Uploads 0\n\Failed Uploads 0\n\Successful Uploads 0\n\Cancelled Uploads 0');
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            case "Cancle":
                return this.app.client.getText('#root > div > div.clearlist-container > div > ul > li:nth-child(1) > a > strong').then(() => {
                    return this.app.client.waitForVisible('#clearList').then(() => {
                        return this.app.client.click('#clearList').then(() => {
                            return this.app.client.waitForVisible('#root > div > div.clearlist-container > div > ul > li:nth-child(4) > a > strong').then(() => {
                                return this.app.client.click('#root > div > div.clearlist-container > div > ul > li:nth-child(4) > a > strong').then(() => {
                                    return this.app.client.pause(3000).then(() => {
                                        return this.app.client.getText('#uploads-tab').then((title) => {
                                            assert.equal(title, 'All Uploads 0\n\Failed Uploads 0\n\Successful Uploads 0\n\Cancelled Uploads 0');
                                        });
                                    });
                                });
                            });
                        });
                    });
                });


            default: return null;
        }
    };
    this.NotificationToasterSuccess = () => {
        return this.app.client.waitForVisible('div > div.toast-title').then(() => {
            return this.app.client.getText('div > div.toast-title').then((title) => {
                assert.equal(title[0], 'Upload Complete');
                assert.equal(title[1], 'Upload Started');
            });
        });
    };
    this.NotificationToasterFailedMessage = () => {
        return this.app.client.waitForVisible('div > div.toast-title').then(() => {
            return this.app.client.getText('div > div.toast-title').then((title) => {
                assert.equal(title[0], 'Upload Failed');
                assert.equal(title[1], 'Upload Started');
            });
        });
    };
    this.cancleProgress = () => {
        return this.app.client.waitForVisible('#main-tab-pane-2 > div > div > div.rootFiles > div:nth-child(1) > button').then(() => {
            return this.app.client.click('#main-tab-pane-2 > div > div > div.rootFiles > div:nth-child(1) > button').then(() => {
                return this.app.client.pause(3000);
            });
        });
    };
    this.cancleProgresbtn = (number) => {
        return this.app.client.waitForVisible('#main-tab-pane-2 > div > div > div.rootFiles > div:nth-child(' + number + ') > button').then(() => {
            return this.app.client.click('#main-tab-pane-2 > div > div > div.rootFiles > div:nth-child(' + number + ') > button').then(() => {
                return this.app.client.pause(3000);
            });
        });
    };
    this.UploaProgressPercentage = (progress) => {
        return this.app.client.waitForVisible('#main-tab-pane-2 > div > div > div.summerycontainer > div > div > div:nth-child(2) > strong').then(() => {
            return this.app.client.getText('#main-tab-pane-2 > div > div > div.summerycontainer > div > div > div:nth-child(2) > strong').then((title) => {
                assert.equal(title, progress);
            });
        });
    };

    this.fileUploadMessage = (uploadMessage) => {
        return this.app.client.pause(8000).getText('#main-tab-pane-2 > div > div > div.rootFiles > div > div > div.uploaderFolder > p > span:nth-child(2)').then((title) => {
            assert.equal(title, uploadMessage);
        });
    };

    this.upLoadfileWithParameter = (filename) => {
        return this.app.client.waitForVisible('#main-tab-tab-1 > strong').then(() => {
            return this.app.client.pause(6000).click('#main-tab-tab-1 > strong').then(() => {
                return this.app.client.waitForVisible('#dropBasket').then(() => {
                    return this.app.client.then(() => {
                        return this.app.client.webContents.executeJavaScript(
                            commands.getDropCommand(filename), true, function (done, result) {
                            }).then(() => {
                                return this.app.client.pause(2000).then(() => {
                                    return this.app.client.click('#main-tab-tab-2 > strong').then(() => {
                                        return this.app.client.click('#main-tab-tab-2 > strong').then(() => {

                                        });
                                    });
                                });
                            });
                    });
                });
            });
        });
    };

    this.toVerifySelectProjectUI = () => {
        return this.app.client.waitForVisible('#root > div > div.topbar > div.projectlist > div > button:nth-child(1)').then(() => {
            return this.app.client.getText('#root > div > div.topbar > div.projectlist > div > button:nth-child(1)').then((selectProjectTitle) => {
                assert.equal(selectProjectTitle, 'Select Project');
            });
        });
    };

    this.toVerifyMenuUI = () => {
        return this.app.client.waitForVisible('#dropdown-no-caret').then(() => {
            return this.app.client.getText('#dropdown-no-caret').then((menuTitle) => {
                assert.equal(menuTitle, 'Menu');
            });
        });
    };

    this.toVerifyChooseAProjectLabel = () => {
        return this.app.client.waitForVisible('#root > div > div.topbar > div.alert.alert-info > p').then(() => {
            return this.app.client.getText('#root > div > div.topbar > div.alert.alert-info > p').then((chooseAPrjTitle) => {
                assert.equal(chooseAPrjTitle, 'Choose a Project where you want to upload files');
            });
        });
    };

    this.setTimeOut = (timeout) => {
        return this.app.client.pause(timeout);
    };

    this.ChangeUploadsTab = (tabSelector, tabName) => {
        return this.app.client.waitForVisible(tabSelector).then(() => {
            return this.app.client.click(tabSelector).then(() => {
                return this.app.client.pause(3000).getText(tabSelector).then((title) => {
                    assert.equal(title, tabName);
                });
            });
        });
    };

    this.toVerifyQuickdropUI = () => {
        return this.app.client.waitForVisible('#locationSwitch').then(() => {
            return this.app.client.getText('#locationSwitch').then((quickDropUITitle) => {
                assert.equal(quickDropUITitle, 'QuickDrop');
            });
        });
    };

 
};

module.exports = HomePage;


