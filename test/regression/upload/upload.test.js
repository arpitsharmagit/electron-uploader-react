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
describe("desktop Uploader Application Regression Tests for Upload", function () {
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
    it('NU-212  Upload : Verify pdf documents Upload functionality less than up to 2 Mb file', () => {
        return page.appLogin().then(() => {
            return homepage.selectProject().then(() => {
                return homepage.checkDefaultTabCount().then(() => {
                    return homepage.upLoadfile('2MbPdf.pdf').then(() => {
                        return homepage.clearListAllUploadList().then(() => {
                            return homepage.upLoadfile('1MbXps.xps');
                        });
                    });
                });
            });
        });
    });
    it('NU-213  Upload : Verify MS Office documents Upload functionality less than up to 2 Mb file', () => {
        return page.appLogin().then(() => {
            return homepage.selectProject().then(() => {
                return homepage.checkDefaultTabCount().then(() => {
                    return homepage.upLoadfile('1mbword.docx').then(() => {
                        return homepage.clearListAllUploadList().then(() => {
                            return homepage.upLoadfile('Docfile.doc').then(() => {
                                return homepage.clearListAllUploadList().then(() => {
                                    return homepage.upLoadfile('Pptfile.ppt').then(() => {
                                        return homepage.clearListAllUploadList().then(() => {
                                            return homepage.upLoadfile('Pptxfile.pptx').then(() => {
                                                return homepage.clearListAllUploadList().then(() => {
                                                    return homepage.upLoadfile('Rtffile.rtf').then(() => {
                                                        return homepage.clearListAllUploadList().then(() => {
                                                            return homepage.upLoadfile('Xlsfile.xls').then(() => {
                                                                return homepage.clearListAllUploadList().then(() => {
                                                                    return homepage.upLoadfile('Xlsxfile.xlsx').then(() => {
                                                                        return homepage.clearListAllUploadList().then(() => {
                                                                            return homepage.upLoadfile('Csvfile.csv').then(() => {
                                                                                return homepage.clearListAllUploadList().then(() => {
                                                                                    return homepage.upLoadfile('Pptmfile.pptm').then(() => {
                                                                                        return homepage.clearListAllUploadList().then(() => {
                                                                                            return homepage.upLoadfile('Dotfile.dot');
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
    it('NU-214  Upload : Verify Image Types documents Upload functionality less than up to 2 Mb file', () => {
        return page.appLogin().then(() => {
            return homepage.selectProject().then(() => {
                return homepage.checkDefaultTabCount().then(() => {
                    return homepage.upLoadfile('Bmpfile.bmp').then(() => {
                        return homepage.clearListAllUploadList().then(() => {
                            return homepage.upLoadfile('Jpegfile.jpg').then(() => {
                                return homepage.clearListAllUploadList().then(() => {
                                    return homepage.upLoadfile('Pngfile.png').then(() => {
                                        return homepage.clearListAllUploadList().then(() => {
                                            return homepage.upLoadfile('Giffile.gif').then(() => {
                                                return homepage.clearListAllUploadList().then(() => {
                                                    return homepage.upLoadfile('Tifffile.tif');
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
    it('NU-215  Upload : Verify Auto CAD documents Upload functionality less than up to 2 Mb file', () => {
        return page.appLogin().then(() => {
            return homepage.selectProject().then(() => {
                return homepage.checkDefaultTabCount().then(() => {
                    return homepage.upLoadfile('Dwgfile.dwg').then(() => {
                        return homepage.clearListAllUploadList().then(() => {
                            return homepage.upLoadfile('Dwffile.dwf').then(() => {
                                return homepage.clearListAllUploadList().then(() => {
                                    return homepage.upLoadfile('Dxffile.dxf');
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    it('NU-216  Upload : Verify Open Office documents Upload functionality less than up to 2 Mb file', () => {
        return page.appLogin().then(() => {
            return homepage.selectProject().then(() => {
                return homepage.checkDefaultTabCount().then(() => {
                    return homepage.upLoadfile('Odtfile.odt');
                });
            });
        });
    });
    it('NU-217  Upload : Verify Binary files documents Upload functionality less than up to 2 Mb file', () => {
        // no tag type found
        return page.appLogin().then(() => {
            return homepage.selectProject().then(() => {
                return homepage.checkDefaultTabCount().then(() => {
                    return homepage.upLoadfile('Black_Dbfile.db');
                });
            });
        });
    });
    it('NU-218  Upload : Verify Zip files documents Upload functionality less than up to 2 Mb file', () => {
        return page.appLogin().then(() => {
            return homepage.selectProject().then(() => {
                return homepage.checkDefaultTabCount().then(() => {
                    return homepage.upLoadfile('zipfile.zip');
                });
            });
        });
    });
    it('NU-220 Upload : Verify Cancel Upload functionality', () => {
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
    it('NU-224 Upload : Verify Graylisted Document Upload functionality', () => {
        return page.appLogin().then(() => {
            return homepage.selectProject().then(() => {
                return homepage.checkDefaultTabCount().then(() => {
                    return homepage.upLoadfile('Gray_Htmlfile.html').then(() => {
                        return homepage.UploaProgressPercentage('100% / 1 of 1 uploaded').then(() => {
                            return homepage.upLoadfile('Gray_Logfile.log').then(() => {
                                return homepage.UploaProgressPercentage('100% / 2 of 2 uploaded').then(() => {
                                    return homepage.upLoadfile('Gray_Mhtfile.mht').then(() => {
                                        return homepage.UploaProgressPercentage('100% / 3 of 3 uploaded').then(() => {
                                            return homepage.upLoadfile('Gray_Dtdfile.dtd').then(() => {
                                                return homepage.UploaProgressPercentage('100% / 4 of 4 uploaded').then(() => {
                                                    return homepage.upLoadfile('Gray_Dwfxfile.dwfx').then(() => {
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
    it('NU-230 Upload : Verify Blacklisted Document Upload functionality', () => {
        return page.appLogin().then(() => {
            return homepage.selectProject().then(() => {
                return homepage.checkDefaultTabCount().then(() => {
                    return homepage.upLoadfile('Black_Avifile.avi').then(() => {
                        return homepage.UploaProgressPercentage('100% / 1 of 1 uploaded').then(() => {
                            return homepage.upLoadfile('Black_Dbfile.db').then(() => {
                                return homepage.UploaProgressPercentage('100% / 2 of 2 uploaded').then(() => {
                                    return homepage.upLoadfile('Black_Mp3file.mp3').then(() => {
                                        return homepage.UploaProgressPercentage('100% / 3 of 3 uploaded').then(() => {
                                            return homepage.upLoadgraylistfile('Black_Mp4file.mp4').then(() => {
                                                return homepage.UploaProgressPercentage('100% / 4 of 4 uploaded').then(() => {
                                                    return homepage.upLoadgraylistfile('Black_Wavfile.wav').then(() => {
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
});
