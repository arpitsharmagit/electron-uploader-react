class TrayUIState {
    constructor() {
        this.totalFiles = 0;
        this.uploaded = 0;
        this.failed = 0;
        this.cancel = 0;
    }
    cancelFile() {
        this.cancel++;
    }
    updateTotalFiles(count) {
        this.totalFiles += count;
    }
    updateFailedFiles() {
        this.failed++;
    }
    updateSuccessFiles() {
        this.uploaded++;
    }
    decrementFailed() {
        this.failed--;
    }
    getPercentageWidth() {
        if (this.totalFiles <= 0) {
            return `0`;
        }
        return ((((this.totalFiles - this.getProcessingFiles()) / this.totalFiles)) * 100).toString();
    }
    getProcessingFiles() {
        const pendingCount = (this.totalFiles - (this.uploaded + this.failed + this.cancel));
        return pendingCount < 0 ? 0 : pendingCount;
    }
    getPercentage() {
        if (this.totalFiles <= 0) {
            return '--';
        }
        return `<span>Documents </span><span class="status status-success">Uploaded<span class="badge">${this.uploaded}</span></span>
        <span class="status status-failed">Failed<span class="badge">${this.failed}</span></span>
        <span class="status status-pending">Pending<span class="badge">${this.getProcessingFiles()}</span></span>`;
    }
    getStatus() {
        if (this.totalFiles <= 0) {
            return 'No Files Uploaded.';
        }
        return `${this.uploaded} of ${this.totalFiles} Documents uploaded`;
    }
}
module.exports = new TrayUIState();
