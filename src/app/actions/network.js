import * as types from "./types";

export function changeNetworkStatus(status) {
    return {
        type: types.NETWORK_STATUS,
        payload: status
    };
}
export function changeAPICallingStatus(status) {
    return {
        type: types.SHOW_API_LOADER,
        payload: status
    };
}
export function userDetailError(isOn) {
    return {
        type: types.USER_DETAILS_ERROR,
        payload: isOn
    };
}
