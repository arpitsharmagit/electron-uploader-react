import { renderComponent, expect } from '../test_helper';
import { FOLDER_ID, FILEROOM_ERROR_ON, FILEROOM_ERROR_OFF, LOGOUT_USER } from "../../../src/app/actions/types";
import * as actions from "../../../src/app/actions";
import reducer from '../../../src/app/reducers/fileroom';

describe('user reducer', () => {
    const defaultState = { fileRoomId: null, folderId: null, fileRoomError: false };

    it('should return the initial state', () => {
        expect(reducer(defaultState, 'Fake_Action')).to.equals(defaultState);
    });

    it('should handle FOLDER_ID selection', () => {
        const folderId = 35;
        let actualResult = reducer(defaultState, { type: FOLDER_ID, payload: folderId});
        expect(actualResult.folderId).to.equal(folderId);
    });
    it('should handle FILEROOM_ERROR_ON', () => {
        let actualResult = reducer(defaultState, { type: FILEROOM_ERROR_ON});
        expect(actualResult.fileRoomError).to.true;
    });
    it('should handle FILEROOM_ERROR_OFF', () => {
        let actualResult = reducer(defaultState, { type: FILEROOM_ERROR_OFF});
        expect(actualResult.fileRoomError).to.false;
    });
    it('should handle user logout', () => {
        let actualResult = reducer(defaultState, { type: LOGOUT_USER});
        expect(actualResult.folderId).to.be.null;
    });
    it('should default case', () => {
        let actualResult = reducer(defaultState, { type: "RANDOM"});
        expect(actualResult).to.equal(defaultState);
    });
});

