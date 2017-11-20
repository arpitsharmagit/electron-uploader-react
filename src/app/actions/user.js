import {USER_PROFILE, LOGOUT_USER} from "./types";

export function userProfile(userData) {
    return {
        type: USER_PROFILE,
        payload: userData
    };
}
export function logoutUser(){
    return {
        type: LOGOUT_USER
    };
}
