const assert = require('assert');
const expect = require('chai').expect;
const trayState = require('../../../../src/desktop/tray/script/trayState');
describe('Loading tray State', function () {
    describe('Initial state', function () {
        it('Total total files count to be zero', function () {
            expect(trayState.totalFiles).to.equal(0);
        });
        it('Total upload count to be zero', function () {
            expect(trayState.uploaded).to.equal(0);
        });
        it('Total failed count to be zero', function () {
            expect(trayState.failed).to.equal(0);
        });
    });
    describe('Initial messages', function () {
        it('Intial percentage message to be --', function () {
            const intialPercentageMsg = '--';
            expect(trayState.getPercentage()).to.equal(intialPercentageMsg);
        });
        it('Intial status message to be No Files Uploaded.', function () {
            const intialStatusMsg = 'No Files Uploaded.';
            expect(trayState.getStatus()).to.equal(intialStatusMsg);
        });
        it('Intial status message to be No Files Uploaded.', function () {
            const intialStatusMsg = '0';
            expect(trayState.getPercentageWidth()).to.equal(intialStatusMsg);
        });
    });
    describe('Operations', function () {
        it('update Total Files count', function () {
            const totalFilesCount = 5;
            const statusMsgExpected = `0 of 5 Documents uploaded`;
            trayState.updateTotalFiles(totalFilesCount);
            const statusMsgActual = trayState.getStatus();
            expect(statusMsgExpected).to.equal(statusMsgActual);
        });
        it('update Total Failed Files count', function () {
            const pendingFileCount = 4;
            trayState.updateFailedFiles();
            const pendingFiles = trayState.getProcessingFiles();
            expect(pendingFiles).to.equal(pendingFileCount);
        });
        it('update Total Success Files count', function () {
            const pendingFileCount = 3;
            const statusMsgExpected = `1 of 5 Documents uploaded`;
            trayState.updateSuccessFiles();
            const pendingFiles = trayState.getProcessingFiles();
            const statusMsgActual = trayState.getStatus();
            const percentageMsgActual = trayState.getStatus();
            expect(pendingFiles).to.equal(pendingFileCount);
            expect(trayState.getPercentage()).to.contain("<span");
            expect(trayState.getStatus()).to.equal(statusMsgExpected);
        });
        it('update file cancel', function () {
            const pendingFileCount = 2;
            trayState.updateFailedFiles();
            const pendingFiles = trayState.getProcessingFiles();
            expect(pendingFiles).to.equal(pendingFileCount);
        });
        it('decrement file failed count for retry', function () {
            const failedFile = trayState.failed;
            trayState.decrementFailed();
            expect(failedFile - 1).to.equal(trayState.failed);
        });
        it('percentage width.', function () {
            const intialpercentage = ((((trayState.totalFiles - trayState.getProcessingFiles())
                / trayState.totalFiles)) * 100).toString();
            expect(trayState.getPercentageWidth()).to.equal(intialpercentage);
        });
    });
});
