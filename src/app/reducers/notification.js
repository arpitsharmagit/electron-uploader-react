import * as types from "../actions/types";
import status from '../helpers/constants';
import update from 'immutability-helper';

export default function upload(state, action) {
    state = state || [];
    switch (action.type) {
        case types.SHOW_NOTIFICATION:
            const { contentId, title, message, type } = action.payload;
            const toastMessage = {
                [contentId]: {
                    contentId, title, message, type
                }
            };
            return update(state, { $push: [toastMessage] });
        case types.NOTIFICATION_COMPLETE:
            return update(state, { $unset: [action.payload.contentId] });
        default:
            return state;
    }
}
