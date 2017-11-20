import apiHelper from './apiHelper';
import status from './constants';
import { uploadContent } from '../actions/upload';
import * as notification from "../actions/notification";
import * as actions from "../actions/upload";
import config from '../../../config';


class uploadQueue {
    constructor() {
        this.totol = new Set();
        this.success = new Set();
        this.failed = new Set();
        this.pending = 0;
        this.concurrency = config.get('app').concurrency;
        this.jobs = [];
        this.jobQueue = [];
    }
    add(dispatch, contentId) {
        this.dispatch = dispatch;
        this.jobs.push(contentId);
        !this.totol.has(contentId) && this.totol.add(contentId);
        this.pending < this.concurrency && this.startNext();
    }
    startNext() {
        let contentId = this.jobs.shift();
        this.jobQueue.push(contentId);
        if (this.pending < 0) {
            this.pending = 0;
        }
        this.pending++;
        this.dispatch(uploadContent(contentId));
    }
    jobComplete(contentId, contentStatus) {
        if (contentStatus) {
            switch (contentStatus) {
                case status.ERROR:
                    !this.failed.has(contentId) && this.failed.add(contentId);
                    break;
                case status.COMPLETE:
                    !this.success.has(contentId) && this.success.add(contentId);
                    break;
                default:
                    break;
            }
        }
        const queueIndex = this.jobQueue.indexOf(contentId);
        if (queueIndex > -1) {
            this.pending--;
            if (this.pending < 0) {
                this.pending = 0;
            }
            this.jobQueue.splice(this.jobQueue.indexOf(contentId), 1);
        }
        let JobIndex = this.jobs.indexOf(contentId);
        if (JobIndex !== -1) {
            this.jobs.splice(JobIndex, 1);
        }
        if (this.jobs.length === 0 && this.jobQueue.length === 0) {
            this.dispatch(actions.queueFinished(contentId));
            return;
        }
        queueIndex > -1 && this.jobs.length && this.startNext();
    }
}

export default new uploadQueue();
