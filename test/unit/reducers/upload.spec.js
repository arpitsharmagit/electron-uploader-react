import { renderComponent, expect } from '../test_helper';
import * as types from "../../../src/app/actions/types";
import * as actions from "../../../src/app/actions";
import status from '../../../src/app/helpers/constants';
import reducer from '../../../src/app/reducers/upload';

describe('upload reducer', () => {
    const defaultState = {
        stats: {
            "01": {
                countProgress: 1,
                countPending: 0,
                countFailed: 0,
                countCompleted: 0,
                countCancelled: 0,
                countTotal: 0,
                overallProgress: 0
            }
        },
        filterStatus: "",
        uploadList: {
            "01": {
                error: "",
                id: "01",
                message: "InProgress",
                name: "Test",
                progress: 0,
                projectId: "01",
                status: 0,
                type: "DOCUMENT"
            }
        }
    };
    it('should return the initial state', () => {
        expect(reducer(defaultState, 'No_Action')).to.equals(defaultState);
    });
    it('should return CREATE_METADATA state ', () => {
        const action = {
            type: 'CREATE_METADATA', payload: {
                "02": {
                    error: "",
                    id: "02",
                    message: "InProgress",
                    name: "Test",
                    type: "DOCUMENT",
                    progress: 0,
                    projectId: "01",
                    status: 0
                }
            },
            isUpload: true
        };
        const actualResult = reducer(defaultState, action);
        expect(actualResult.uploadList).to.have.property('02');
    });
    it('should return filter state ', () => {
        const action = { type: 'FILTER_LIST', payload: 'IN_PROGRESS', isUpload: true };
        expect(reducer(defaultState, action)).to.have.property('filterStatus', 'IN_PROGRESS');
    });
    it('Login_User Action should return default state ', () => {
        const action = { type: 'LOGIN_USER', payload: { contentId: 1 }, isUpload: true };
        const initState = {
            Notifications: [],
            filterStatus: "",
            stats: {},
            uploadList: {}
        };
        expect(reducer(initState, action)).to.deep.equal(initState);
    });
    it('PROJECT_SELECTION Action should return default state ', () => {
        const action = { type: 'PROJECT_SELECTION', payload: { projectId: 1 }, isUpload: true };
        const initState = {
            Notifications: [],
            filterStatus: "",
            stats: {},
            uploadList: {}
        };
        const expectedState = {
            Notifications: [],
            filterStatus: "",
            stats: {
                [1]: {
                    countPending: 0,
                    countProgress: 0,
                    countFailed: 0,
                    countCompleted: 0,
                    countCancelled: 0,
                    countTotal: 0,
                    overallProgress: 0
                }
            },
            uploadList: {}
        };
        expect(reducer(initState, action)).to.deep.equal(expectedState);
    });
    it('should return UPDATE_PROGRESS state ', () => {
        const action = { type: 'UPDATE_PROGRESS', isUpload: true, payload: { contentId: '01', percentage: 10, loaded: 30, total: 100 } };
        const actualResult = reducer(defaultState, action);
        expect(actualResult.uploadList['01']).to.have.property('progress', 10);
    });
    it('should return UPLOAD_COMPLETE state ', () => {
        const action = { type: 'UPLOAD_COMPLETE', isUpload: true, payload: { contentId: '01' } };
        const actualResult = reducer(defaultState, action);
        expect(actualResult.uploadList['01']).to.have.property('status', status.COMPLETE);
    });
    it('should return UPLOAD_FAILED state ', () => {
        const action = { type: 'UPLOAD_FAILED', isUpload: true, payload: { contentId: '01' } };
        const actualResult = reducer(defaultState, action);
        expect(actualResult.uploadList['01']).to.have.property('status', status.ERROR);
    });
    it('should return RETRY_UPLOAD state ', () => {
        const action = { type: 'RETRY_UPLOAD', isUpload: true, payload: { contentId: '01' } };
        const actualResult = reducer(defaultState, action);
        expect(actualResult.uploadList['01']).to.have.property('id', '01');
    });
    it('should return CLEAR_LIST state ', () => {
        const initState = {
            stats: {
                "01": {
                    countProgress: 2,
                    countPending: 2,
                    countFailed: 0,
                    countCompleted: 0,
                    countCancelled: 0,
                    countTotal: 0
                }
            },
            uploadList: {
                "01": { id: "01", projectId: "01", status: status.PENDING },
                "02": { id: "02", projectId: "01", status: status.INPROGRESS },
                "03": { id: "03", projectId: "01", status: status.INPROGRESS },
                "04": { id: "04", projectId: "01", status: status.PENDING }
            }
        };
        const expectedState = {
            stats: {
                "01": {
                    countProgress: 0,
                    countPending: 0,
                    countFailed: 0,
                    countCompleted: 0,
                    countCancelled: 0,
                    countTotal: 0
                }
            },
            uploadList: {
                "01": { id: "01", projectId: "01", status: status.PENDING },
                "04": { id: "04", projectId: "01", status: status.PENDING }
            }
        };
        const action = { type: 'CLEAR_LIST', isUpload: true, payload: ["02", "03"] };
        const actualState = reducer(initState, action);
        expect(actualState).to.deep.equal(expectedState);
    });
    it('should return CANCEL_UPLOAD state ', () => {
        const initState = {
            stats: {
                "01": {
                    countProgress: 0,
                    countPending: 0,
                    countFailed: 0,
                    countCompleted: 0,
                    countCancelled: 0,
                    overallProgress: 0
                }
            },
            uploadList: {
                "01": { id: "01", status: status.PENDING, message: "Uplaoding...", projectId: "01", "progress": 0 },
                "02": { id: "02", status: status.INPROGRESS, message: "Uplaoding...", projectId: "01" }
            }
        };
        const expectedState = {
            stats: {
                "01": {
                    countProgress: 1,
                    countPending: 0,
                    countFailed: 0,
                    countCompleted: 0,
                    countCancelled: 1,
                    overallProgress: 0
                }
            },
            uploadList: {
                "01": { id: "01", status: status.CANCEL, message: "Cancelled.", projectId: "01", "progress": 0 },
                "02": { id: "02", status: status.INPROGRESS, message: "Uplaoding...", projectId: "01" }
            }
        };
        const action = { type: 'CANCEL_UPLOAD', isUpload: true, payload: { contentId: "01" } };
        const actualState = reducer(initState, action);
        expect(actualState).to.deep.equal(expectedState);
    });
    it('should return UPLOAD_START state ', () => {
        const contentId = "01", uploadRequest = {};
        const action = {
            type: types.UPLOAD_START,
            payload: { contentId, uploadRequest },
            isUpload: true
        };
        const initState = {
            stats: {
                "01": {
                    countProgress: 0,
                    countPending: 0,
                    countFailed: 0,
                    countCompleted: 0,
                    countCancelled: 0
                }
            },
            uploadList: {
                "01": {
                    attempts: 0,
                    status: status.PENDING,
                    progress: 0,
                    message: "",
                    uploadTask: null,
                    projectId: "01",
                    error: ""
                }
            }
        };
        const expectedState = {
            stats: {
                "01": {
                    countProgress: 0,
                    countPending: 0,
                    countFailed: 0,
                    countCompleted: 0,
                    countCancelled: 0
                }
            },
            uploadList: {
                "01": {
                    attempts: 1,
                    status: status.INPROGRESS,
                    progress: 0,
                    message: "Uploading...",
                    uploadTask: {},
                    projectId: "01",
                    error: ""
                }
            }
        };
        const actualState = reducer(initState, action);
        expect(actualState.uploadList).to.deep.equal(expectedState.uploadList);
    });
    it('should default case', () => {
        let actualResult = reducer(defaultState, { type: "RANDOM" });
        expect(actualResult).to.equal(defaultState);
    });
});
