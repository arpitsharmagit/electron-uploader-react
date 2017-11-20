import { FOLDER_ID, FILEROOM_ERROR_ON, FILEROOM_ERROR_OFF, LOGOUT_USER, LOGIN_USER, DROP_LOCATION, PROJECT_SELECTION } from "../actions/types";
const defaultState = { fileRoomId: null, folderId: null, fileRoomError: false, isMyFolders: false };
export default function location(state, action) {
    state = state || defaultState;
    switch (action.type) {
        case LOGIN_USER:
            return defaultState;
        case FOLDER_ID:
            state = { ...state };
            state.folderId = action.payload;
            return state;
        case FILEROOM_ERROR_ON:
            state = { ...state };
            state.fileRoomError = true;
            state.folderId = null;
            return state;
        case FILEROOM_ERROR_OFF:
            state = { ...state };
            state.fileRoomError = false;
            return state;
        case LOGOUT_USER:
            state = { ...state };
            state.folderId = null;
            return state;
        case PROJECT_SELECTION:
            return {...state, isMyFolders: false };
        case DROP_LOCATION:
            state = { ...state, isMyFolders: action.payload};
            return state;
        default:
            return state;
    }
}
