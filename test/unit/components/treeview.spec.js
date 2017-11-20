import { renderComponent, expect, fetchMock, sinon } from '../test_helper';
import TreeView from '../../../src/app/components/Home/treeview';
import config from '../../../config';

const API = config.get('API');

const dummyfileRooms = [{
    'id': 1,
    leaf: false,
    'name': 'one'
}];
const state = {
    "user": {
        "project": {
            "projectId": 5
        }
    }
};
const props = {
    projectId: 5,
    onGetNodes: () => {
        return new Promise(resolve => {
            resolve(dummyfileRooms);
        });
    },
    innerRender: () => {

    },
    outerRender: () => {

    },
    onDrop: () => {

    },
    checkLeaf: () => {

    },
    onSelectNode: () => {

    }
};

describe('TreeView :: ', () => {
    it('should render', () => {
        fetchMock.get(API.baseUrl + API.fileroom.replace(':projectId', state.user.project.projectId), (url, opts) => {
            return {
                status: 200,
                body: JSON.stringify({ "children": [] })
            };
        });
        const component = renderComponent(TreeView, props, state);
        expect(component).to.exist;
        fetchMock.restore();
    });
});
