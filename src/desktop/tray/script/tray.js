const openAppId = 'openapp';
const docSummaryId = 'docsummary';
const docPercantage = 'percentage';
const progressdivId = "progressdiv";
const openDS1 = 'openweb';
var ipcRenderer = require('electron').ipcRenderer;
var trayUIState = require('./trayState');
const docSummaryUIElement = document.getElementById(docSummaryId);
const percentageUIElement = document.getElementById(docPercantage);
const percentagedivUIElement = document.getElementById(progressdivId);
// event binding
const openInAPPelement = document.getElementById(openAppId);
openInAPPelement && openInAPPelement.addEventListener('click', function () {
    ipcRenderer && ipcRenderer.send('tray-event-tray-open');
});
const openDSElement = document.getElementById(openDS1);
openDSElement && openDSElement.addEventListener('click', function () {
    ipcRenderer && ipcRenderer.send('tray-event-web-open');
});
function updateUIStatus() {
    docSummaryUIElement.innerText = trayUIState.getStatus();
    percentageUIElement.innerHTML = trayUIState.getPercentage();
    percentagedivUIElement.style.width = trayUIState.getPercentageWidth() + '%';
}
function newFilesAdded(count) {
    trayUIState.updateTotalFiles(count);
    updateUIStatus();
}
function uploadComplete(success) {
    success ? trayUIState.updateSuccessFiles() : trayUIState.updateFailedFiles();
    updateUIStatus();
}
function uploadCanceled() {
    trayUIState.cancelFile();
    updateUIStatus();
}
function uploadRetry(){
    trayUIState.decrementFailed();
    updateUIStatus();
}
function processIPCMessage(arg) {
    switch (arg.type) {
        case "FILEADD":
            newFilesAdded(arg.count);
            break;
        case "UPLOAD_FAILED":
            uploadComplete(false);
            break;
        case "UPLOAD_COMPLETE":
            uploadComplete(true);
            break;
        case "UPLOAD_CANCEL":
            uploadCanceled();
            break;
        case "UPLOAD_RETRY":
            uploadRetry();
        break;
        default:
            break;
    }
}
// subscribe IPC msg
ipcRenderer.on('tray-event-upload', function (e, arg) {
    processIPCMessage(arg);
});

// Update state on start
module.exports = { updateUIStatus };
