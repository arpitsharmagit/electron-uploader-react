import { NETWORK_STATUS, SHOW_API_LOADER, USER_DETAILS_ERROR, LOGIN_USER } from "../actions/types";
const networkStatus = { online: true, calingAPI: false, userDetailError: false };
export default function network(state, action) {
    state = state || networkStatus;
    switch (action.type) {
        case LOGIN_USER:
            return networkStatus;
        case NETWORK_STATUS:
            return Object.assign({}, state, { online: action.payload });
        case SHOW_API_LOADER:
            return Object.assign({}, state, { callingAPI: action.payload });
        case USER_DETAILS_ERROR:
            return Object.assign({}, state, { userDetailError: action.payload });
        default:
            return state;
    }
}

