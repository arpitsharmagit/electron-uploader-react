import { LOGIN_USER } from "./types";

export function loginUser(token, refresh_token) {
    return {
        type: LOGIN_USER,
        payload: token,
        refresh_token: refresh_token,
        isUpload: true
    };
}
