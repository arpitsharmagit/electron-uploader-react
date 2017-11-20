import { expect, sinon } from '../test_helper';
import status from '../../../src/app/helpers/constants';
import uploadQueue from '../../../src/app/helpers/uploadQueue';

describe('uploadQueue- Test', () => {
    it('should have blank jobs array on init', () => {
        uploadQueue.pending = 0;
        expect(uploadQueue.jobs.length).to.equals(0);
        expect(uploadQueue.jobQueue.length).to.equals(0);
    });
    it('should have added new upload', () => {
        const dispatch = sinon.spy();
        const uploadContent = sinon.spy();
        uploadQueue.add(dispatch, 1);
        expect(uploadQueue.jobs.length).to.equals(0);
        expect(uploadQueue.jobQueue.length).to.equals(1);
    });
    it('should have added another upload', () => {
        const dispatch = sinon.spy();
        const uploadContent = sinon.spy();
        uploadQueue.add(dispatch, 2);
        expect(uploadQueue.jobs.length).to.equals(0);
        expect(uploadQueue.jobQueue.length).to.equals(2);
        uploadQueue.add(dispatch, 3);
        expect(uploadQueue.jobs.length).to.equals(1);
        expect(uploadQueue.jobQueue.length).to.equals(2);
    });
    it('should have job complete', () => {
        const dispatch = sinon.spy();
        const uploadContent = sinon.spy();
        uploadQueue.jobComplete(2, status.COMPLETE);
        expect(uploadQueue.jobs.length).to.equals(0);
        expect(uploadQueue.jobQueue.length).to.equals(2);
        uploadQueue.jobComplete(3);
        expect(uploadQueue.jobs.length).to.equals(0);
        expect(uploadQueue.jobQueue.length).to.equals(1);
    });
    it('should reset pending if -1', () => {
        const dispatch = sinon.spy();
        const uploadContent = sinon.spy();
        uploadQueue.pending = -2;
        uploadQueue.add(dispatch, 4);
        uploadQueue.pending = -2;
        uploadQueue.jobComplete(4, status.PENDING);
        expect(uploadQueue.pending).to.equals(0);
    });
});
