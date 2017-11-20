import { renderComponent, expect, sinon, assert, fetchMock } from '../test_helper';
import * as actions from "../../../src/app/actions";
import * as types from "../../../src/app/actions/types";
import apihelper from "../../../src/app/helpers/apiHelper";
import status from "../../../src/app/helpers/constants";
import config from '../../../config';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const API = config.get('API');

const initialState = {
    user: { profile: { emailAddress: "docmetadata1@mailinator.com" } },
    location: {
        fileRoomId: null,
        folderId: null,
        fileRoomError: false
    }
};

describe('Types ::', () => {
    it('LOADING type should be defined', () => {
        expect(types.LOADING).to.exist;
    });
    it('FILEROOM_ERROR_ON type should be defined', () => {
        expect(types.FILEROOM_ERROR_ON).to.exist;
    });
    it('LOADING_DONE type should be defined', () => {
        expect(types.LOADING_DONE).to.exist;
    });
    it('FOLDER_ID type should be defined', () => {
        expect(types.FOLDER_ID).to.exist;
    });
    it('PROJECT_SELECTION type should be defined', () => {
        expect(types.PROJECT_SELECTION).to.exist;
    });
    it('PORJECT_CHANGE type should be defined', () => {
        expect(types.PORJECT_CHANGE).to.exist;
    });
});
describe('Actions', () => {
    it('Actions should be defined', () => {
        expect(actions).to.exist;
    });
    it('Actions selectProject should be defined', () => {
        expect(actions.fileroom.selectProject).to.exist;
    });
    it('Action - calling selectProject', () => {
        let store = mockStore(initialState);
        const projectId = 35;
        // No upload Folder
        fetchMock.get(API.baseUrl + API.fileroom.replace(':projectId', projectId), (url, opts) => {
            return {
                status: 200,
                body: JSON.stringify({ "children": [] })
            };
        });
        fetchMock.post(API.baseUrl + API.createMetadata.replace(':projectId', projectId), function getSession(url, opts) {
            return {
                status: 201,
                body: JSON.stringify({
                    "contents": [
                        { "id": "59c1032e9f4b03001368ba22", "name": "QuickDrop", "displayIndex": "", "extension": null, "type": "FILEROOM", "createDate": "2017-09-19T11:44:46.629Z", "deletedDate": null, "fileSize": null, "pageCount": 0, "accessLevel": "EDIT", "status": "DONE", "active": true, "favorite": false, "read": false, "categoryId": null, "categoryName": null, "streamAvailable": false, "baseBlobId": null, "groupId": null, "downloadOnly": null, "publishingStatus": "PUBLISHED", "correlationId": "1", "failureReason": null },
                        { "id": "59c1032e9f4b03001368ba23", "name": "docmetadata1@mailinator.com", "displayIndex": "1", "extension": null, "type": "FOLDER", "createDate": "2017-09-19T11:44:46.638Z", "deletedDate": null, "fileSize": null, "pageCount": 0, "accessLevel": "EDIT", "status": "DONE", "active": null, "favorite": false, "read": false, "categoryId": null, "categoryName": null, "streamAvailable": false, "baseBlobId": null, "groupId": "94f1f172-a6b2-414f-b5f9-a477d9ca8d66", "downloadOnly": null, "publishingStatus": "PUBLISHED", "correlationId": "1.1", "failureReason": null },
                        { "id": "59c1032e9f4b03001368ba24", "name": "DESKTOP", "displayIndex": "1.1", "extension": null, "type": "FOLDER", "createDate": "2017-09-19T11:44:46.646Z", "deletedDate": null, "fileSize": null, "pageCount": 0, "accessLevel": "EDIT", "status": "DONE", "active": null, "favorite": false, "read": false, "categoryId": null, "categoryName": null, "streamAvailable": false, "baseBlobId": null, "groupId": "94f1f172-a6b2-414f-b5f9-a477d9ca8d66", "downloadOnly": null, "publishingStatus": "PUBLISHED", "correlationId": "1.1.1", "failureReason": null }]
                })
            };
        });
        store.dispatch(actions.fileroom.selectProject({ projectId })).then(() => {
            const expectedActions = ['PROJECT_SELECTION',
                'LOADING',
                'LOADING_DONE',
                'FILEROOM_ERROR_OFF',
                'FOLDER_ID',
                'LOADING_DONE',
                'FILEROOM_ERROR_OFF'];
            const actualActions = store.getActions().map(action => action.type);
            fetchMock.restore();
            return expect(actualActions).to.deep.equal(expectedActions);
        });

        // No Upload Folder end

        //  Upload Folder Exists, but no user folder 
        fetchMock.get(API.baseUrl + API.fileroom.replace(':projectId', projectId), function getSession(url, opts) {
            return {
                status: 200,
                body: JSON.stringify({ "children": [{ "id": "59c0d9159f4b030013688f48", "type": "FILEROOM", "name": "QuickDrop", "displayIndex": "", "leaf": false, "active": false, "publishingStatus": "PARTIAL", "createDate": 1505810709.978000000, "accessLevel": "EDIT" }] })
            };
        });
        fetchMock.get(API.baseUrl + API.fileroom.replace(':projectId', projectId) + '?parentId=59c0d9159f4b030013688f48', function getSession(url, opts) {
            return {
                status: 200,
                body: JSON.stringify({ "children": [] })
            };
        });
        fetchMock.post(API.baseUrl + API.createMetadata.replace(':projectId', projectId), function getSession(url, opts) {
            return {
                status: 201,
                body: JSON.stringify({
                    "contents": [
                        { "id": "59c1032e9f4b03001368ba23", "name": "docmetadata1@mailinator.com", "displayIndex": "1", "extension": null, "type": "FOLDER", "createDate": "2017-09-19T11:44:46.638Z", "deletedDate": null, "fileSize": null, "pageCount": 0, "accessLevel": "EDIT", "status": "DONE", "active": null, "favorite": false, "read": false, "categoryId": null, "categoryName": null, "streamAvailable": false, "baseBlobId": null, "groupId": "94f1f172-a6b2-414f-b5f9-a477d9ca8d66", "downloadOnly": null, "publishingStatus": "PUBLISHED", "correlationId": "1.1", "failureReason": null },
                        { "id": "59c1032e9f4b03001368ba24", "name": "DESKTOP", "displayIndex": "1.1", "extension": null, "type": "FOLDER", "createDate": "2017-09-19T11:44:46.646Z", "deletedDate": null, "fileSize": null, "pageCount": 0, "accessLevel": "EDIT", "status": "DONE", "active": null, "favorite": false, "read": false, "categoryId": null, "categoryName": null, "streamAvailable": false, "baseBlobId": null, "groupId": "94f1f172-a6b2-414f-b5f9-a477d9ca8d66", "downloadOnly": null, "publishingStatus": "PUBLISHED", "correlationId": "1.1.1", "failureReason": null }]
                })
            };
        });
        store = mockStore(initialState);
        store.dispatch(actions.fileroom.selectProject({ projectId })).then(() => {
            const expectedActions = ['PROJECT_SELECTION',
                'LOADING',
                'LOADING_DONE',
                'FILEROOM_ERROR_OFF',
                'FOLDER_ID',
                'LOADING_DONE',
                'FILEROOM_ERROR_OFF'];
            const actualActions = store.getActions().map(action => action.type);
            fetchMock.restore();
            return expect(actualActions).to.deep.equal(expectedActions);
        });
        // Upload Folder Exists, but no user folder, end

        //  Upload Folder Exists, but no user folder 
        fetchMock.get(API.baseUrl + API.fileroom.replace(':projectId', projectId), function getSession(url, opts) {
            return {
                status: 200,
                body: JSON.stringify({ "children": [{ "id": "59c0d9159f4b030013688f48", "type": "FILEROOM", "name": "QuickDrop", "displayIndex": "", "leaf": false, "active": false, "publishingStatus": "PARTIAL", "createDate": 1505810709.978000000, "accessLevel": "EDIT" }] })
            };
        });
        fetchMock.get(API.baseUrl + API.fileroom.replace(':projectId', projectId) + '?parentId=59c0d9159f4b030013688f48', function getSession(url, opts) {
            return {
                status: 200,
                body: JSON.stringify({ "children": [{ "id": "59c1032e9f4b03001368ba24", "type": "FOLDER", "name": "DESKTOP", "displayIndex": "", "leaf": false, "active": false, "publishingStatus": "PARTIAL", "createDate": 1505810709.978000000, "accessLevel": "EDIT" }] })
            };
        });
        fetchMock.get(API.baseUrl + API.fileroom.replace(':projectId', projectId) + '?parentId=59c1032e9f4b03001368ba24', function getSession(url, opts) {
            return {
                status: 200,
                body: JSON.stringify({ "children": [] })
            };
        });
        fetchMock.post(API.baseUrl + API.createMetadata.replace(':projectId', projectId), function getSession(url, opts) {
            return {
                status: 201,
                body: JSON.stringify({
                    "contents": [
                        { "id": "59c1032e9f4b03001368ba23", "name": "docmetadata1@mailinator.com", "displayIndex": "1", "extension": null, "type": "FOLDER", "createDate": "2017-09-19T11:44:46.638Z", "deletedDate": null, "fileSize": null, "pageCount": 0, "accessLevel": "EDIT", "status": "DONE", "active": null, "favorite": false, "read": false, "categoryId": null, "categoryName": null, "streamAvailable": false, "baseBlobId": null, "groupId": "94f1f172-a6b2-414f-b5f9-a477d9ca8d66", "downloadOnly": null, "publishingStatus": "PUBLISHED", "correlationId": "1.1", "failureReason": null }
                    ]
                })
            };
        });
        store = mockStore(initialState);
        store.dispatch(actions.fileroom.selectProject({ projectId })).then(() => {
            const expectedActions = ['PROJECT_SELECTION',
                'LOADING',
                'LOADING_DONE',
                'FILEROOM_ERROR_OFF',
                'FOLDER_ID',
                'LOADING_DONE',
                'FILEROOM_ERROR_OFF'];
            const actualActions = store.getActions().map(action => action.type);
            fetchMock.restore();
            return expect(actualActions).to.deep.equal(expectedActions);
        });
        // Upload Folder Exists, but no user folder, end
    });
    // it('Action - calling selectProject failing fileroom get case', () => {
    //     const store = mockStore(initialState);
    //     const projectId = 35;
    //     // No upload Folder
    //     fetchMock.get(API.baseUrl + API.fileroom.replace(':projectId', projectId), (url, opts) => {
    //         return {
    //             status: 500
    //         };
    //     });
    //     store.dispatch(actions.fileroom.selectProject({ projectId })).then(() => {
    //         const expectedActions = ['PROJECT_SELECTION',
    //             'LOADING',
    //             'FILEROOM_ERROR_ON',
    //             'LOADING_DONE'];
    //         const actualActions = store.getActions().map(action => action.type);
    //         fetchMock.restore();
    //         return expect(actualActions).to.deep.equal(expectedActions);
    //     });
    // });
});
