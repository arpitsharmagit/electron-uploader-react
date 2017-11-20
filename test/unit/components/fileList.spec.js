import { renderComponent, expect, sinon, assert } from '../test_helper';
import path from 'path';
import FileList from '../../../src/app/components/Home/fileList';
global.window.require = function () {
    return {
        ipcRenderer: {
            send: function () {
                // Fake sending message to ipcMain
            }
        }
    };
};
const ipcRenderer = window.require('electron').ipcRenderer;

const state = {
    "user": {
        "project": {
            "projectId": "591b10726e65f10010a42267"
        }
    },
    "location": {},
    "network": {},
    "upload": {
        stats: {
            "591b10726e65f10010a42267": {
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
            "59b913f2b23f6b0013dd3782": {
                "id": "59b913f2b23f6b0013dd3782",
                "name": "Root",
                "type": "FOLDER",
                "status": -1,
                "projectId": "591b10726e65f10010a42267",
                "parentId": "59a808ce5882c10015a27b47",
                "progress": 0,
                "attempts": 0,
                "allowRetry": true
            },
            "59b913f2b23f6b0013dd3789": {
                "id": "59b913f2b23f6b0013dd3789",
                "name": "EmbeddedSmallFile",
                "type": "DOCUMENT",
                "status": 2,
                "projectId": "591b10726e65f10010a42267",
                "parentId": "59a808ce5882c10015a27b47",
                "progress": 0,
                "attempts": 0,
                "allowRetry": true,
                "bytesMessage": "",
                "message": "Uploading...",
                "error": "",
                "filePath": path.join(__dirname, "../../test-data/TestDoc.docx"),
                "isRoot": true
            },
            "59b913f2b23f6b0013dd3780": {
                "id": "59b913f2b23f6b0013dd3780",
                "name": "EmbeddedSmallFile",
                "type": "DOCUMENT",
                "status": 3,
                "projectId": "591b10726e65f10010a42267",
                "parentId": "59a808ce5882c10015a27b47",
                "progress": 40,
                "attempts": 0,
                "allowRetry": true,
                "bytesMessage": "",
                "message": "Uploading...",
                "error": "",
                "filePath": path.join(__dirname, "../../test-data/TestDoc.docx"),
                "isRoot": true
            },
            "59b913f2b23f6b0013dd3781": {
                "id": "59b913f2b23f6b0013dd3781",
                "name": "EmbeddedSmallFile",
                "type": "DOCUMENT",
                "status": 3,
                "projectId": "591b10726e65f10010a42267",
                "parentId": "59a808ce5882c10015a27b47",
                "progress": 0,
                "attempts": 2,
                "allowRetry": false,
                "bytesMessage": "",
                "message": "Uploading...",
                "error": "",
                "filePath": path.join(__dirname, "../../test-data/TestDoc.docx"),
                "isRoot": true
            },
            "59b913f2b23f6b0013dd3788": {
                "id": "59b913f2b23f6b0013dd3788",
                "name": "EmbeddedSmallFile",
                "type": "DOCUMENT",
                "status": 4,
                "projectId": "591b10726e65f10010a42267",
                "parentId": "59a808ce5882c10015a27b47",
                "progress": 0,
                "attempts": 0,
                "allowRetry": true,
                "bytesMessage": "",
                "message": "Uploading...",
                "error": "",
                "filePath": path.join(__dirname, "../../test-data/TestDoc.docx"),
                "isRoot": true
            },
            "59b913f2b23f6b0013dd3787": {
                "id": "59b913f2b23f6b0013dd3787",
                "name": "EmbeddedSmallFile",
                "type": "DOCUMENT",
                "status": 0,
                "projectId": "591b10726e65f10010a42267",
                "parentId": "59a808ce5882c10015a27b47",
                "progress": 0,
                "attempts": 0,
                "allowRetry": true,
                "bytesMessage": "",
                "message": "Uploading...",
                "error": "",
                "filePath": path.join(__dirname, "../../test-data/TestDoc.docx"),
                "isRoot": true
            },
            "59b913f2b23f6b0013dd3786": {
                "id": "59b913f2b23f6b0013dd3786",
                "name": "EmbeddedSmallFile",
                "type": "DOCUMENT",
                "status": 1,
                "projectId": "591b10726e65f10010a42267",
                "parentId": "59a808ce5882c10015a27b47",
                "progress": 0,
                "attempts": 0,
                "allowRetry": true,
                "bytesMessage": "",
                "message": "Uploading...",
                "error": "",
                "filePath": path.join(__dirname, "../../test-data/TestDoc.docx"),
                "isRoot": true
            },
            "59b913f2b23f6b0013dd3785": {
                "id": "59b913f2b23f6b0013dd3785",
                "name": "EmbeddedSmallFile",
                "type": "DOCUMENT",
                "status": 8,
                "projectId": "591b10726e65f10010a42267",
                "parentId": "59a808ce5882c10015a27b47",
                "progress": 0,
                "attempts": 0,
                "allowRetry": true,
                "bytesMessage": "",
                "message": "Uploading...",
                "error": "",
                "filePath": path.join(__dirname, "../../test-data/TestDoc.docx"),
                "isRoot": true
            }
        }
    }
};
const props = {
    uploadContent: () => sinon.spy(),
    cancelUpload: () => sinon.spy()
};

describe('FileList', () => {
    let ipc_spy = null, wrapper = null;
    beforeEach(() => {
        wrapper = renderComponent(FileList, props, state);
    });
    it('should render correctly', () => {
        expect(wrapper).to.exist;
    });
    it('should have view Online link for 59b913f2b23f6b0013dd3789 doc', () => {
        expect(wrapper.find("a[href^='#']")).to.exist;
    });
    it('should open link for 59b913f2b23f6b0013dd3789 doc on click', () => {
        ipc_spy = sinon.stub(ipcRenderer, 'send').returns(false);
        wrapper.find("a[href^='#']").simulate('click');
        expect(ipc_spy.calledOnce).to.be.false;
        ipc_spy.restore();
    });
});
