import { renderComponent, expect, fetchMock, sinon } from '../test_helper';
import Toast from '../../../src/app/components/Common/toaster';

const state = {
    "notification": [{
        [1]: {
            contentId: 1,
            title: "Success",
            message: "Success Message",
            type: "success"
        }
    },
    {
        [2]: {
            contentId: 2,
            title: "Error",
            message: "Error Message",
            type: "error"
        }
    }
    ]
};

const props = {
    removeToast: () => sinon.spy()
};

describe('Toast :: ', () => {
    it('should render', () => {
        const component = renderComponent(Toast, props, state);
        expect(component).to.exist;
    });
});
