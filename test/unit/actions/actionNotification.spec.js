import { expect } from '../test_helper';
import * as actions from "../../../src/app/actions";
import * as types from "../../../src/app/actions/types";

describe('Notification ::', () => {
    const contentId = 1, message = "done", title = 'test', type = "success";
    it('action type should be SHOW_NOTIFICATION', () => {
        let action = actions.notification.showToast(contentId, title, message, type);
        expect(action.type).to.equal(types.SHOW_NOTIFICATION);
    });
    it('action type should be NOTIFICATION_COMPLETE', () => {
        let action = actions.notification.removeToast(contentId);
        expect(action.type).to.equal(types.NOTIFICATION_COMPLETE);
    });
});
