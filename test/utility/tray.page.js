const common = require('./common');
const { openappSelector, openWebPageSelector, docSummarySelector, percentageSelector } = require('./selectors');
const { minimizeCommand } = require("../utility/jscommand");
var TrayPage = function() {
    var app;
    this.setApp = (app_n) => {
        this.app = app_n;
    };
    this.getmainWindow = () => {
        return this.app.client.windowByIndex(1);
    };
    this.getTrayWindow = () => {
        return this.app.client.windowByIndex(0).waitUntilWindowLoaded(10000);
    };
    this.closeMainPage = () => {
        return this.getmainWindow().then(() => {
            return this.app.client.browserWindow.minimize();
        });
    };
    this.openMainWindow = () => {
        return this.getTrayWindow().then(() => {
            return this.app.client.browserWindow.show().then(() => {
                return this.app.client.waitForEnabled(openappSelector, 4000, false).click(openappSelector);
            });
        });
    };
    this.waitForAppLoad = () => {
        return this.app.client.waitUntilWindowLoaded(10000);
    };
    this.openOpenUrl = () => {
        return this.getTrayWindow().then(() => {
            return this.app.client.browserWindow.show()
                .waitForEnabled(openWebPageSelector, 4000, false)
                .click(openWebPageSelector);
        });
    };
    this.isMainVisible = () => {
        return this.waitForAppLoad().then(() => {
            return this.getmainWindow().then(() => {
                return this.app.client.browserWindow.isMinimized();
            });
        });
    };
    this.isTrayVisible = () => {
        return this.getmainWindow().then(() => {
            return this.app.client.browserWindow.isFocused();
        });
    };
    this.getInitialSummary = () => {
        return this.getTrayWindow().then(() => {
            return this.app.client.getText(docSummarySelector);
        });
    };
    this.getStats = (stats) => {
        return this.getTrayWindow().then(() => {
            return this.app.client.getText(percentageSelector);
        });
    };
};

module.exports = TrayPage;
