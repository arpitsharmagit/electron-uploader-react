import { renderComponent, expect, sinon } from '../test_helper';
import TestUtils from 'react-dom/test-utils';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import jsdom from 'jsdom';
import assert from 'assert';
import reducers from '../../../src/app/reducers';
import DropContainer from '../../../src/app/components/Common/drop';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const state = {
    user: { isLoggedIn: false, jwt: null, profile: {}, projects: [], project: { projectId: '591b10726e65f10010a42267' } },
    location: { folderId: "59a808ce5882c10015a27b46" }
};
const props = {
    createMetadata: sinon.spy()
};
const filepath = "fakefile";
const files = [
    {
        "webkitGetAsEntry": () => {
            return {
                file: (cb) => {
                    cb({
                        fullPath: filepath,
                        isDirectory: false,
                        name: "2MbPdf.pdf",
                        path: filepath
                    });
                },
                fullPath: filepath,
                isDirectory: false,
                isFile: true,
                name: "2MbPdf.pdf"
            };
        }
    }
];
describe('Drop component', () => {
    let component;
    it('renders drop component', () => {
        const componentInstance
            = TestUtils.renderIntoDocument(
                <Provider store={createStore(reducers, state)}>
                    <DropContainer {...props} />
                </Provider>
            );
        component = ReactDOM.findDOMNode(componentInstance);
        expect(component).to.exist;
    });

    it('should have simulate drop events', () => {
        const mockEvent = {
            preventDefault: sinon.spy(), dataTransfer: {
                files: [], items: files
            }
        };
        TestUtils.Simulate.dragStart(component, mockEvent);
        TestUtils.Simulate.dragOver(component, mockEvent);
        TestUtils.Simulate.drop(component, mockEvent);
        TestUtils.Simulate.dragEnd(component, mockEvent);
        TestUtils.Simulate.dragLeave(component, mockEvent);
        expect(component).to.exist;
    });
});
