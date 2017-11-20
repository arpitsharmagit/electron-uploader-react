import { renderComponent, expect, fetchMock, sinon } from '../test_helper';
import TreeWrapper from '../../../src/app/components/Home/treeWrapper';
import config from '../../../config';

const API = config.get('API');

const state = {
    "user": {
        "project": {
            "projectId": 5
        }
    }
};

const props = {
    projectId: 5,
    createMetadata: () => sinon.spy()
};

describe('TreeWrapper :: ', () => {
    it('should render', () => {
        fetchMock.get(API.baseUrl + API.fileroom.replace(':projectId', state.user.project.projectId), (url, opts) => {
            return {
                status: 200,
                body: JSON.stringify({ "children": [] })
            };
        });
        const component = renderComponent(TreeWrapper, props, state);
        expect(component).to.exist;
        fetchMock.restore();
    });
});
