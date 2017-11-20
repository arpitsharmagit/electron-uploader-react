const testkeys = require('./teststatekeys');
const selectors = require('./selectors');

var LoginPage = function () {
    var app;

    this.windowCount = 1;
    this.pageTitle = 'desktop Uploader';
     this.Id = 'gmail.com';
    this.capsId = 'gmail.com';
    this.caps_Id = 'gmail.com';
    this.Password = 'Password';
    this.invalidId = 'hotmail.com';
    this.invalidPassword = 'Password2';
    this.userName = 'Alice Walker';

    this.setApp = (app_n) => {
        this.app = app_n;
    };

    this.getWindowCount = () => {
        return this.app.client.waitUntilWindowLoaded().getWindowCount();
    };

    this.getApplicationTitle = () => {
        return this.app.client.waitUntilWindowLoaded().getTitle();
    };

    this.clickLoginButton = () => {
        return this.app.client.click(selectors.signInButton);
    };
    this.enterUsername = (username) => {
        return this.app.client.windowByIndex(1).waitUntilWindowLoaded(10000).setValue(selectors.userIdTexbox, username);
    };
    this.enterPwd = (passwd) => {
        return this.app.client.setValue(selectors.userPasswordTexbox, passwd);
    };
    this.checkedKeepmeloginCheckBox = () => {
        return this.app.client.pause(5000).then(() => {
            return this.app.client.click('input[type="checkbox"]').then(() => {
                return this.app.client.pause(2000);
            });
        });
    };
    this.clickKeepmeloginCheckBox = () => {
        return this.app.client.pause(5000).then(() => {
            return this.app.client.click('input[type="checkbox"]').then(() => {
                return this.app.client.pause(2000).then(() => {
                    return this.clickLoginButton();
                });
            });
        });
    };
    this.appLogin = () => {
        return this.enterUsername(testkeys.userId).then(() => {
            return this.enterPwd(testkeys.Password).then(() => {
                return this.clickLoginButton();
            });
        });
    };
    this.appCaseSensitiveLogin = () => {
        return this.app.client.windowByIndex(1).waitUntilWindowLoaded(10000).setValue('input[type="text"]', this.capsId).then(() => {
            return this.app.client.setValue('input[name="password"]', this.Password).then(() => {
                return this.clickLoginButton();
            });
        });
    };
    this.appCaseSensitiveCapsLogin = () => {
        return this.app.client.windowByIndex(1).waitUntilWindowLoaded(10000).setValue('input[type="text"]', this.caps_Id).then(() => {
            return this.app.client.setValue('input[name="password"]', this.Password).then(() => {
                return this.clickLoginButton();
            });
        });
    };
    this.appLoginInvalidCred = (paramt) => {
        switch (paramt) {
            case "Id":
                return this.enterUsername(this.invalidId).then(() => {
                    return this.enterPwd(this.Password).then(() => {
                        return this.clickLoginButton();
                    });
                });
            case "Pwd":
                return this.enterUsername('').then(() => {
                    return this.enterUsername(this.Id).then(() => {
                        return this.enterPwd('').then(() => {
                            return this.enterPwd(this.invalidPassword).then(() => {
                                return this.clickLoginButton();
                            });
                        });
                    });
                });
            default: return null;
        }
    };
    this.appKeepMeLoginInvalidCred = (paramt) => {
        switch (paramt) {
            case "Id":
                return this.enterUsername(this.invalidId).then(() => {
                    return this.enterPwd(this.Password).then(() => {
                        return this.clickKeepmeloginCheckBox();
                    });
                });

            case "Pwd":
                return this.enterUsername('').then(() => {
                    return this.enterUsername(this.Id).then(() => {
                        return this.enterPwd('').then(() => {
                            return this.enterPwd(this.invalidPassword).then(() => {
                                return this.clickKeepmeloginCheckBox();
                            });
                        });
                    });
                });

            default: return null;
        }
    };
    this.appLoginSqlInjection = () => {
        return this.app.client.windowByIndex(1).waitUntilWindowLoaded(10000).setValue('input[type="text"]', this.Id).then(() => {
            return this.app.client.setValue('input[name="password"]', this.Id).then(() => {
                return this.clickLoginButton().then(() => {
                    return this.verifyInvalidCredMessage().then(() => {
                        return this.app.client.windowByIndex(1).waitUntilWindowLoaded(10000).setValue('input[type="text"]', this.Id).then(() => {
                            return this.app.client.setValue('input[name="password"]', "' or '1'='1").then(() => {
                                return this.clickLoginButton().then(() => {
                                    return this.verifyInvalidCredMessage().then(() => {
                                        return this.app.client.windowByIndex(1).waitUntilWindowLoaded(10000).setValue('input[type="text"]', this.Id).then(() => {
                                            return this.app.client.setValue('input[name="password"]', "' or 1='1").then(() => {
                                                return this.clickLoginButton().then(() => {
                                                    return this.verifyInvalidCredMessage().then(() => {
                                                        return this.app.client.windowByIndex(1).waitUntilWindowLoaded(10000).setValue('input[type="text"]', this.Id).then(() => {
                                                            return this.app.client.setValue('input[name="password"]', "1' or 1=1 -- -").then(() => {
                                                                return this.clickLoginButton().then(() => {
                                                                    return this.verifyInvalidCredMessage().then(() => {
                                                                        return this.app.client.windowByIndex(1).waitUntilWindowLoaded(10000).setValue('input[type="text"]', "' or '1'='1").then(() => {
                                                                            return this.app.client.setValue('input[name="password"]', "' or '1'='1").then(() => {
                                                                                return this.clickLoginButton().then(() => {
                                                                                    return this.verifyInvalidCredMessage().then(() => {
                                                                                        return this.app.client.windowByIndex(1).waitUntilWindowLoaded(10000).setValue('input[type="text"]', "' or ' 1=1").then(() => {
                                                                                            return this.app.client.setValue('input[name="password"]', "' or ' 1=1").then(() => {
                                                                                                return this.clickLoginButton().then(() => {
                                                                                                    return this.verifyInvalidCredMessage();
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
                });
            });
        });
    };
    this.appLoginWithKeepLogin = () => {
        return this.app.client.windowByIndex(1).waitUntilWindowLoaded(10000).setValue('input[type="text"]', this.Id).then(() => {
            return this.app.client.setValue('input[name="password"]', this.Password).then(() => {
                return this.clickKeepmeloginCheckBox();
            });
        });
    };
    this.verifyInvalidCredMessage = () => {
        return this.app.client.pause(7000).then(() => {
            return this.app.client.getText('#root > div > div.contentContainer > form > div:nth-child(3) > div').should.eventually.equal('We didn\'t recognize the username or password you entered. Please try again.')
        });
    };
    this.loginWithUserNameOnly = () => {
        return this.enterUsername(this.Id).then(() => {
            return this.clickLoginButton().then(() => {
                return this.enterUsername('');
            });
        });
    };
    this.loginWithUserPwdOnly = () => {
        return this.enterPwd(this.Password).then(() => {
            return this.clickLoginButton().then(() => {
                return this.enterPwd('');
            });
        });
    };
    this.keepMeloginWithUserNameOnly = () => {
        return this.enterUsername(this.Id).then(() => {
            return this.clickKeepmeloginCheckBox().then(() => {
                return this.enterUsername('');
            });
        });
    };
    this.keepMeloginWithUserPwdOnly = () => {
        return this.enterUsername('').then(() => {
            return this.enterPwd(this.Password).then(() => {
                return this.clickKeepmeloginCheckBox().then(() => {
                    return this.enterUsername('');
                });
            });
        });
    };
};

module.exports = LoginPage;
