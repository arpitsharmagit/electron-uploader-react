import { renderComponent, expect } from '../test_helper';
import * as types from "../../../src/app/actions/types";
import * as actions from "../../../src/app/actions";
import reducer from '../../../src/app/reducers/user';

describe('user reducer', () => {
    let userState = { isLoggedIn: false, jwt: null, profile: {}, projects: [] };

    it('should return the initial state', () => {
        expect(reducer(userState, 'Fake_Action')).to.equals(userState);
    });

    it('should handle LOGIN_USER', () => {
        userState = { isLoggedIn: false, jwt: null, profile: {}, projects: [] };
        let expectedState = { "isLoggedIn": true, "jwt": "token", "profile": {}, "projects": [] };
        let actualResult = reducer(userState, { type: types.LOGIN_USER, payload: 'token' });
        expect(actualResult).to.have.property('jwt', 'token');
    });

    it('should handle USER_PROFILE', () => {
        userState = { isLoggedIn: false, jwt: null, profile: {}, projects: [] };
        let expectedState = { isLoggedIn: false, jwt: null, profile: null, projects: null };

        let actualResult = reducer(userState, {
            type: types.USER_PROFILE,
            payload: { profile: {}, projects: [] }
        });

        expect(actualResult).to.have.property('profile');
        expect(actualResult).to.have.property('projects');
    });
    it('should handle PROJECT_SELECTION', () => {
        let actualResult = reducer(userState, {
            type: types.PROJECT_SELECTION,
            payload: { 'name': 'myproject' }
        });

        expect(actualResult.project).to.have.property('name', 'myproject');
    });
    it('should handle LOADING', () => {
        let actualResult = reducer(userState, {
            type: types.LOADING
        });

        expect(actualResult).to.have.property('showProgress', true);
    });
    it('should handle LOADING_DONE', () => {
        let actualResult = reducer(userState, {
            type: types.LOADING_DONE
        });

        expect(actualResult).to.have.property('showProgress', false);
    });
    it('should default case', () => {
        let actualResult = reducer(userState, { type: "RANDOM"});
        expect(actualResult).to.equal(userState);
    });
});

