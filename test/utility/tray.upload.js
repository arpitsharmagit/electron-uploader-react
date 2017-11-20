var commands = require("../utility/jscommand");
var assert = require('assert');
const {
    projectSelector,
    projectItemSelector,
    dropTabSelector,
    dropBasketSelector,
    progressTabSelector,
    failUploadSelector,
    successUploadSelector,
    cancelUploadSelector
 } = require('./selectors');
var TrayUploadhelper = function() {
    this.setApp = (app_n) => {
        this.app = app_n;
    };
    this.selectProject = () => {
        return this.app.client.pause(7000)
            .waitForEnabled(projectSelector, 7000, false)
            .click(projectSelector)
            .click(projectItemSelector)
            .pause(2000);
    };
    this.upLoadfile = (filename) => {
        return this.app.client.waitForVisible(dropTabSelector).then(() => {
            return this.app.client.click(dropTabSelector).then(() => {
                return this.app.client.waitForVisible(dropBasketSelector).then(() => {
                    return this.app.client.then(() => {
                        return this.app.client.webContents.executeJavaScript(
                            commands.getDropCommand(filename), true, function(done, result) {
                            }).then(() => {
                                return this.app.client.pause(2000).then(() => {
                                    return this.app.client.click(progressTabSelector).then(() => {
                                        return this.app.client.click(progressTabSelector).then(() => {
                                            return this.app.client.waitUntilTextExists(successUploadSelector, '/ Successfully Uploaded', 600000);
                                        });
                                    });
                                });
                            });
                    });
                });
            });
        });
    };
    this.upLoadfileFail = (filename) => {
        return this.app.client.waitForVisible(dropTabSelector).then(() => {
            return this.app.client.click(dropTabSelector).then(() => {
                return this.app.client.waitForVisible(dropBasketSelector).then(() => {
                    return this.app.client.then(() => {
                        return this.app.client.webContents.executeJavaScript(
                            commands.getDropCommand(filename), true, function(done, result) {
                            }).then(() => {
                                return this.app.client.pause(2000).then(() => {
                                    return this.app.client.click(progressTabSelector).then(() => {
                                        return this.app.client.click(progressTabSelector).then(() => {
                                            return this.app.client.waitUntilTextExists(failUploadSelector, '/ Upload Failed. VIRUS_DETECTED', 360000).then(() => {
                                                return this.app.client.getText(failUploadSelector).then((s) => {
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
    };
    this.upLoadgraylistfile = (filename) => {
        return this.app.client.waitForVisible(dropTabSelector).then(() => {
            return this.app.client.click(dropTabSelector).then(() => {
                return this.app.client.waitForVisible(dropBasketSelector).then(() => {
                    return this.app.client.then(() => {
                        return this.app.client.webContents.executeJavaScript(
                            commands.getDropCommand(filename), true, function(done, result) {
                            }).then(() => {
                                return this.app.client.pause(2000).then(() => {
                                    return this.app.client.click(progressTabSelector).then(() => {
                                        return this.app.client.click(progressTabSelector).then(() => {
                                        }).pause(3000);
                                    });
                                });
                            });
                    });
                });
            });
        });
    };

    this.cancleProgress = () => {
        return this.app.client.waitForVisible(cancelUploadSelector).then(() => {
            return this.app.client.click(cancelUploadSelector).pause(5000);
        });
    };
};
module.exports = TrayUploadhelper;
