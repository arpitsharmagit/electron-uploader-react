import { expect } from '../test_helper';
import { NETWORK_STATUS, SHOW_API_LOADER } from "../../../src/app/actions/types";
import * as actions from "../../../src/app/actions";
import reducer from '../../../src/app/reducers/network';

describe('network reducer', () => {
    const defaultState = { online: true, callingAPI: false };
    it('should return the initial state', () => {
        expect(reducer(defaultState, 'Fake_Action')).to.equals(defaultState);
    });
    it('should handle offline', () => {
        let actualResult = reducer(defaultState, { type: NETWORK_STATUS, payload: false });
        expect(actualResult.online).to.equal(false);
    });
    it('should handle online', () => {
        let actualResult = reducer(defaultState, { type: NETWORK_STATUS, payload: true });
        expect(actualResult.online).to.equal(true);
    });
    it('should handle callingAPI -ON', () => {
        let actualResult = reducer(defaultState, { type: SHOW_API_LOADER, payload: true });
        expect(actualResult.callingAPI).to.equal(true);
    });
    it('should handle callingAPI -OFF', () => {
        let actualResult = reducer(defaultState, { type: SHOW_API_LOADER, payload: false });
        expect(actualResult.callingAPI).to.equal(false);
    });
    it('should default case', () => {
        let actualResult = reducer(defaultState, { type: "RANDOM"});
        expect(actualResult).to.equal(defaultState);
    });
});

