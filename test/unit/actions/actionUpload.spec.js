import { renderComponent, expect, sinon, assert, fetchMock } from '../test_helper';
import * as actions from "../../../src/app/actions";
import * as types from "../../../src/app/actions/types";
import apihelper from "../../../src/app/helpers/apiHelper";
import uploadQueue from "../../../src/app/helpers/uploadQueue";
import status from "../../../src/app/helpers/constants";
import config from "../../../config";
import path from 'path';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const API = config.get('API');

const initialState = {
    upload: {
        stats: {
            "591b10726e65f10010a42267": {
                countProgress: 1,
                countPending: 0,
                countFailed: 0,
                countCompleted: 0,
                countCancelled: 0,
                countTotal: 0,
                overallProgress: 0
            },
            "myProject": {
                countProgress: 1,
                countPending: 0,
                countFailed: 0,
                countCompleted: 0,
                countCancelled: 0,
                countTotal: 0,
                overallProgress: 0
            }
        },
        uploadList: {
            "59b913f2b23f6b0013dd3789": {
                "id": "59b913f2b23f6b0013dd3789",
                "name": "EmbeddedSmallFile",
                "displayIndex": "1.1.244",
                "extension": "xlsx",
                "type": "DOCUMENT",
                "createDate": "2017-09-13T11:18:10.347Z",
                "deletedDate": null,
                "fileSize": 0,
                "pageCount": 0,
                "accessLevel": "EDIT",
                "status": 2,
                "active": null,
                "favorite": false,
                "read": false,
                "categoryId": null,
                "categoryName": null,
                "streamAvailable": false,
                "baseBlobId": "6cdd8ed0-6c5f-412c-b331-5db434d55edc",
                "groupId": "99dd8649-0b5e-4dcc-884b-be60c104d7e7",
                "downloadOnly": false,
                "publishingStatus": "UNPUBLISHED",
                "correlationId": "1.1",
                "failureReason": null,
                "projectId": "591b10726e65f10010a42267",
                "parentId": "59a808ce5882c10015a27b47",
                "progress": 0,
                "attempts": 0,
                "allowRetry": true,
                "bytesMessage": "",
                "message": "Uploading...",
                "error": "",
                "filePath": path.join(__dirname, "../../test-data/TestDoc.docx"),
                "contentType": "",
                "isRoot": true,
                uploadTask: {
                    abort: sinon.spy()
                }
            }
        }
    }
};

describe('Types ::', () => {
    it('UPDATE_PROGRESS type should be defined', () => {
        expect(types.UPDATE_PROGRESS).to.exist;
    });
    it('UPLOAD_COMPLETE type should be defined', () => {
        expect(types.UPLOAD_COMPLETE).to.exist;
    });
    it('UPLOAD_COMPLETE type should be defined', () => {
        expect(types.UPLOAD_FAILED).to.exist;
    });
    it('SERVER_ERROR type should be defined', () => {
        expect(types.SERVER_ERROR).to.exist;
    });
});
describe('Upload Actions', () => {
    const contentId = "59b913f2b23f6b0013dd3789";
    it('Actions should be defined', () => {
        expect(actions.upload).to.exist;
    });
    it('Action - should set correct filter status in store', () => {
        let actionResult = actions.upload.filter('ERROR');
        let expectedResult = {
            type: types.FILTER_LIST,
            payload: 'ERROR',
            isUpload: true
        };
        expect(actionResult.payload).to.equals('ERROR');
    });
    it('Action - calling updateProgress', () => {
        const progressData = { loaded: "1MB", total: "10MB", percentage: 10 };
        let actionResult = actions.upload.updateProgress(progressData, contentId);
        expect(actionResult).to.have.a.property('type');
        expect(actionResult).to.have.a.property('payload');
        expect(actionResult.payload).to.have.a.property('loaded');
        expect(actionResult.payload).to.have.a.property('total');
        expect(actionResult.payload).to.have.a.property('percentage');
        expect(actionResult.payload).to.have.a.property('contentId');
    });
    it('Action - calling uploadFinihsed', () => {
        let actionResult = actions.upload.uploadFinished({}, contentId);
        expect(actionResult).to.have.a.property('type');
        expect(actionResult).to.have.a.property('payload');
        expect(actionResult.payload).to.have.a.property('contentId');
    });
    it('Action - calling uploadFaild', () => {
        let actionResult = actions.upload.uploadFailed("failed to upload", "System Error", false, contentId);
        expect(actionResult).to.have.a.property('type');
        expect(actionResult).to.have.a.property('payload');
        expect(actionResult.payload).to.have.a.property('contentId', contentId);
        expect(actionResult.payload).to.have.a.property('message', "failed to upload");
        expect(actionResult.payload).to.have.a.property('error', "System Error");
        expect(actionResult.payload).to.have.a.property('allowRetry', false);
    });
    it('Action - cancel Upload', () => {
        const store = mockStore(initialState);
        const expectedActions = [types.CANCEL_UPLOAD];
        uploadQueue.add(sinon.spy(), contentId);
        store.dispatch(actions.upload.cancelUpload(contentId));
        const actualActions = store.getActions().map(action => action.type);
        expect(actualActions).to.include(types.CANCEL_UPLOAD);
    });
    it('Action - cancel Upload', () => {
        const store = mockStore(initialState);
        const expectedActions = [types.CLEAR_LIST];
        store.dispatch(actions.upload.removeUpload(contentId));
        const actualActions = store.getActions().map(action => action.type);
        expect(actualActions).to.include(types.CLEAR_LIST);
    });
    it('Action - calling uploadContent for success upload ', () => {
        const store = mockStore(initialState);
        store.dispatch(actions.upload.uploadContent(contentId));
        const actualActions = store.getActions().map(action => action.type);
        expect(actualActions).to.include(types.UPLOAD_START);
    });
    it('Action - calling uploadContent for content not exist ', () => {
        const store = mockStore(initialState);
        uploadQueue.add(sinon.spy(), 'fakecontent');
        store.dispatch(actions.upload.uploadContent("fakecontent"));
        const actualActions = store.getActions().map(action => action.type);
        expect(actualActions).to.include(types.UPLOAD_FAILED);
    });
    it('Action - calling ClearList ', () => {
        const uploadState = {
            user: {
                project: { projectId: "591b10726e65f10010a42267" }
            },
            upload: {
                filterStatus: status.COMPLETE,
                uploadList: {
                    "59b913f2b23f6b0013dd3786": { id: "59b913f2b23f6b0013dd3786", projectId: "591b10726e65f10010a42267", "status": 2, displayIndex: "1.1", type: "DOCUMENT" },
                    "59b913f2b23f6b0013dd3787": { id: "59b913f2b23f6b0013dd3787", projectId: "591b10726e65f10010a42267", "status": 2, displayIndex: "1.1.1", type: "DOCUMENT" },
                    "59b913f2b23f6b0013dd3789": { id: "59b913f2b23f6b0013dd3789", projectId: "591b10726e65f10010a42267", "status": 2, displayIndex: "1.1.1", type: "DOCUMENT"}
                }
            }
        };
        const store = mockStore(uploadState);
        store.dispatch(actions.upload.clearList());
        const actualAction = store.getActions().map(action => action.type);
        const actualPayload = store.getActions().map(action => action.payload);
        expect(actualAction).to.include(types.CLEAR_LIST);
        expect(actualPayload[0].length).to.equal(3);
    });
    it('Action - create Metadata from file Picker', () => {
        fetchMock.post(API.baseUrl + API.createMetadata.replace(':projectId', 'myProject'), function getSession(url, opts) {
            return {
                status: 201,
                body: JSON.stringify({
                    "contents": [{ "id": "59bf8c50f50b9d001309b966", "name": "EmbeddedSmallFile", "displayIndex": "1.1.262", "extension": "xlsx", "type": "DOCUMENT", "createDate": "2017-09-18T09:05:20.257Z", "deletedDate": null, "fileSize": 0, "pageCount": 0, "accessLevel": "EDIT", "status": "INITIAL", "active": null, "favorite": false, "read": false, "categoryId": null, "categoryName": null, "streamAvailable": false, "baseBlobId": "98715781-fb16-417b-9a3b-1b1348c60cb0", "groupId": "08f0a4ab-4883-4d23-b2af-9197d6e5d651", "downloadOnly": false, "publishingStatus": "UNPUBLISHED", "correlationId": "1.1", "failureReason": null }]
                })
            };
        });

        const store = mockStore(initialState);
        const expectedActions = [types.CANCEL_UPLOAD];
        const testData = {
            projectId: 'myProject',
            parentId: 'root',
            files: [{
                lastModified: 1503391757222,
                name: "EmbeddedSmallFile.xlsx",
                path: path.join(__dirname, "../../test-data/TestDoc.docx"),
                size: 296626,
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                webkitRelativePath: ""
            }],
            isfromPicker: true
        };
        store.dispatch(actions.upload.createMetadata(testData.projectId, testData.parentId,
            testData.files, testData.isfromPicker)).then(() => {
                const actualActions = store.getActions().map(action => action.type);
                expect(actualActions).to.include(types.CREATE_METADATA);
                expect(actualActions).to.include(types.UPLOAD_FAILED);
            });
        fetchMock.restore();
    });
    it('Action - create Metadata from drag drop', () => {
        fetchMock.post(API.baseUrl + API.createMetadata.replace(':projectId', 'myProject'), function getSession(url, opts) {
            return {
                status: 201,
                body: JSON.stringify({
                    "contents": [{ "id": "59bf8c50f50b9d001309b966", "name": "EmbeddedSmallFile", "displayIndex": "1.1.262", "extension": "xlsx", "type": "DOCUMENT", "createDate": "2017-09-18T09:05:20.257Z", "deletedDate": null, "fileSize": 0, "pageCount": 0, "accessLevel": "EDIT", "status": "INITIAL", "active": null, "favorite": false, "read": false, "categoryId": null, "categoryName": null, "streamAvailable": false, "baseBlobId": "98715781-fb16-417b-9a3b-1b1348c60cb0", "groupId": "08f0a4ab-4883-4d23-b2af-9197d6e5d651", "downloadOnly": false, "publishingStatus": "UNPUBLISHED", "correlationId": "1.1", "failureReason": null }]
                })
            };
        });

        const store = mockStore(initialState);
        const expectedActions = [types.CANCEL_UPLOAD];
        const testData = {
            projectId: 'myProject',
            parentId: 'root',
            files: [{
                fullPath: "/EmbeddedSmallFile.xlsx",
                isDirectory: false,
                isFile: true,
                name: "EmbeddedSmallFile.xlsx",
                file: () => {
                    return {
                        lastModified: 1503391757222,
                        name: "EmbeddedSmallFile.xlsx",
                        path: "",
                        size: 296626,
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        webkitRelativePath: ""
                    };
                },
                webkitGetAsEntry: () => {
                    return {
                        fullPath: "/EmbeddedSmallFile.xlsx",
                        isDirectory: false,
                        isFile: true,
                        name: "EmbeddedSmallFile.xlsx",
                        file: () => {
                            return {
                                lastModified: 1503391757222,
                                name: "EmbeddedSmallFile.xlsx",
                                path: path.join(__dirname, "../../test-data/TestDoc.docx"),
                                size: 296626,
                                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                webkitRelativePath: ""
                            };
                        }
                    };
                }
            }],
            isfromPicker: false
        };
        store.dispatch(actions.upload.createMetadata(testData.projectId, testData.parentId,
            testData.files, testData.isfromPicker));
        const actualActions = store.getActions().map(action => action.type);
        expect(actualActions.length).to.equal(1);
        fetchMock.restore();
    });
});
