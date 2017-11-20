import * as types from "./types";

export function showToast(contentId, title, message, type) {
    return {
        type: types.SHOW_NOTIFICATION,
        payload: { contentId, title, message, type }
    };
}
export function removeToast(contentId) {
    return {
        type: types.NOTIFICATION_COMPLETE,
        payload: { contentId }
    };
}

