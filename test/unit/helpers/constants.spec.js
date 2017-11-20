import { expect } from '../test_helper';
import status from '../../../src/app/helpers/constants';
describe('constants ', function () {
    it('constants to have PENDING status', () => {
        expect(status.PENDING).to.be.equal(0);
    });
    it('constants to have INPROGRESS status', () => {
        expect(status.INPROGRESS).to.be.equal(1);
    });
    it('constants to have COMPLETE status', () => {
        expect(status.COMPLETE).to.be.equal(2);
    });
    it('constants to have ERROR status', () => {
        expect(status.ERROR).to.be.equal(3);
    });
    it('constants to have CANCEL status', () => {
        expect(status.CANCEL).to.be.equal(4);
    });
});
