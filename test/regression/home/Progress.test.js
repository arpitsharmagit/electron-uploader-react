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
describe("desktop Uploader Application Regression Tests for Progress Bar", function () {
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
    it('NU-186 Progress Bar : Verify  the progress bar calculation for overall progress on number of file basis', () => {
        return page.appLogin().then(() => {
            return homepage.selectProject().then(() => {
                return homepage.checkDefaultTabCount().then(() => {
                    return homepage.cancleupLoadfile('50MbPdf.pdf').then(() => {
                        return homepage.cancleProgress().then(() => {
                            return homepage.UploaProgressPercentage('0% / 0 of 1 uploaded').then(() => {
                                return homepage.upLoadfile('1MbXps.xps').then(() => {
                                    return homepage.UploaProgressPercentage('50% / 1 of 2 uploaded').then(() => {
                                        return homepage.upLoadfile('1mbword.docx').then(() => {
                                            return homepage.UploaProgressPercentage('67% / 2 of 3 uploaded').then(() => {
                                                return homepage.upLoadfile('2MbPdf.pdf').then(() => {
                                                    return homepage.UploaProgressPercentage('75% / 3 of 4 uploaded').then(() => {
                                                        return homepage.upLoadfile('empty.txt').then(() => {
                                                            return homepage.UploaProgressPercentage('60% / 3 of 5 uploaded').then(() => {
                                                                return homepage.Verifystats('All Uploads 5\n\Failed Uploads 1\n\Successful Uploads 3\n\Cancelled Uploads 1');
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
    it('NU-187 Progress Bar : Verify the progress bar calculation for overall progress of all failed files on number of file basis', () => {
        return page.appLogin().then(() => {
            return homepage.selectProject().then(() => {
                return homepage.checkDefaultTabCount().then(() => {
                    return homepage.upLoadfailedfile('empty.txt').then(() => {
                        return homepage.UploaProgressPercentage('0% / 0 of 1 uploaded').then(() => {
                            return homepage.upLoadfile('empty.txt').then(() => {
                                return homepage.UploaProgressPercentage('0% / 0 of 2 uploaded').then(() => {
                                    return homepage.upLoadfile('empty.txt').then(() => {
                                        return homepage.UploaProgressPercentage('0% / 0 of 3 uploaded').then(() => {
                                            return homepage.upLoadgraylistfile('empty.txt').then(() => {
                                                return homepage.UploaProgressPercentage('0% / 0 of 4 uploaded').then(() => {
                                                    return homepage.upLoadfile('empty.txt').then(() => {
                                                        return homepage.UploaProgressPercentage('0% / 0 of 5 uploaded').then(() => {
                                                            return homepage.Verifystats('All Uploads 5\n\Failed Uploads 5\n\Successful Uploads 0\n\Cancelled Uploads 0');
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
    it('NU-188 Progress Bar : Verify the progress bar calculation for overall progress of all success files on number of file basis', () => {
        return page.appLogin().then(() => {
            return homepage.selectProject().then(() => {
                return homepage.checkDefaultTabCount().then(() => {
                    return homepage.upLoadfile('2MbPdf.pdf').then(() => {
                        return homepage.UploaProgressPercentage('100% / 1 of 1 uploaded').then(() => {
                            return homepage.upLoadfile('1MbXps.xps').then(() => {
                                return homepage.UploaProgressPercentage('100% / 2 of 2 uploaded').then(() => {
                                    return homepage.upLoadfile('1mbword.docx').then(() => {
                                        return homepage.UploaProgressPercentage('100% / 3 of 3 uploaded').then(() => {
                                            return homepage.upLoadgraylistfile('Pptfile.ppt').then(() => {
                                                return homepage.UploaProgressPercentage('100% / 4 of 4 uploaded').then(() => {
                                                    return homepage.upLoadfile('Docfile.doc').then(() => {
                                                        return homepage.UploaProgressPercentage('100% / 5 of 5 uploaded').then(() => {
                                                            return homepage.Verifystats('All Uploads 5\n\Failed Uploads 0\n\Successful Uploads 5\n\Cancelled Uploads 0');
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
    it('NU-189 Progress Bar : Verify the progress bar calculation for overall progress of cancle files on number of file basis', () => {
        return page.appLogin().then(() => {
            return homepage.selectProject().then(() => {
                return homepage.checkDefaultTabCount().then(() => {
                    return homepage.cancleupLoadfile('50MbPdf.pdf').then(() => {
                        return homepage.cancleProgress().then(() => {
                            return homepage.UploaProgressPercentage('0% / 0 of 1 uploaded').then(() => {
                                return homepage.cancleupLoadfile('50MbPdf.pdf').then(() => {
                                    return homepage.cancleProgresbtn('2').then(() => {
                                        return homepage.UploaProgressPercentage('0% / 0 of 2 uploaded').then(() => {
                                            return homepage.cancleupLoadfile('50MbPdf.pdf').then(() => {
                                                return homepage.cancleProgresbtn('3').then(() => {
                                                    return homepage.UploaProgressPercentage('0% / 0 of 3 uploaded').then(() => {
                                                        return homepage.cancleupLoadfile('50MbPdf.pdf').then(() => {
                                                            return homepage.cancleProgresbtn('4').then(() => {
                                                                return homepage.UploaProgressPercentage('0% / 0 of 4 uploaded').then(() => {
                                                                    return homepage.cancleupLoadfile('50MbPdf.pdf').then(() => {
                                                                        return homepage.cancleProgresbtn('5').then(() => {
                                                                            return homepage.UploaProgressPercentage('0% / 0 of 5 uploaded').then(() => {
                                                                                return homepage.Verifystats('All Uploads 5\n\Failed Uploads 0\n\Successful Uploads 0\n\Cancelled Uploads 5');
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

