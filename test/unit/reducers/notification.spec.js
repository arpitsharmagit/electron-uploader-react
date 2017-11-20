import { renderComponent, expect } from '../test_helper';
import * as types from "../../../src/app/actions/types";
import * as actions from "../../../src/app/actions";
import reducer from '../../../src/app/reducers/notification';

describe('upload reducer', () => {
    const defaultState = [];
    it('should return the initial state', () => {
        expect(reducer(defaultState, 'No_Action')).to.equals(defaultState);
    });
    it('should return SHOW_NOTIFICATION state ', () => {
        const contentId = 1, message = "done", title = 'test', type = "success";
        const action = {
            type: types.SHOW_NOTIFICATION,
            payload: { contentId, title, message, type }
        };
        const expectedState = [{
            [contentId]: {
                contentId, title, message, type
            }
        }];
        const actualState = reducer(defaultState, action);
        expect(actualState).to.deep.equal(expectedState);
    });
    it('should return NOTIFICATION_COMPLETE state ', () => {
        const contentId = 1, message = "done", title = 'test', type = "success";
        const initalState = [{
            [contentId]: {
                contentId, title, message, type
            }
        }];
        const expectedState = [];
        const action = {
            type: types.NOTIFICATION_COMPLETE,
            payload: { contentId }
        };
        const actualState = reducer(defaultState, action);
        expect(actualState).to.deep.equal(expectedState);
    });
});
