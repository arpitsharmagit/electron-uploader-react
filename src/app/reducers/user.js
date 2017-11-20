import { LOGIN_USER, USER_PROFILE, PROJECT_SELECTION, PORJECT_CHANGE, LOADING, LOADING_DONE, LOGOUT_USER } from "../actions/types";
import status from '../helpers/constants';
const userDefaultState = {
    isLoggedIn: false, jwt: null, profile: {}, projects: [], project: {}
};
export default function user(state, action) {
    state = state || userDefaultState;
    switch (action.type) {
        case LOGIN_USER:
            let newState_l = { ...state };
            newState_l.jwt = action.payload;
            newState_l.isLoggedIn = true;
            return newState_l;
        case USER_PROFILE:
            let newState_p = { ...state };
            newState_p.profile = action.payload.profile;
            newState_p.projects = action.payload.projects;
            return newState_p;
        case PROJECT_SELECTION:
            let newState_selection = { ...state };
            newState_selection.project = action.payload;
            return newState_selection;
        case LOADING:
            state = { ...state };
            state.showProgress = true;
            return state;
        case LOADING_DONE:
            state = { ...state };
            state.showProgress = false;
            return state;
        case LOGOUT_USER:
            return { ...state, isLoggedIn: false, jwt: null, project: {} };
        default:
            return state;
    }
}
