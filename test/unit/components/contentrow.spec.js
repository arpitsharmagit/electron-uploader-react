import { renderComponent, expect, sinon, assert } from '../test_helper';
import path from 'path';
import ContentRow from '../../../src/app/components/Common/contentrow';
import status from '../../../src/app/helpers/constants';

const state = {
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
    handleDeeplink: () => sinon.spy(),
    getbgClass: (content) => {
        switch (content.status) {
            case status.PENDING:
                return "pending";
            case status.ERROR:
            case status.CANCEL:
                return "danger";
            case status.INPROGRESS:
                return "warning";
            case status.COMPLETE:
                return "success";
            default:
                return "pending";
        }
    },
    getGlyphClass: (content) => {
        switch (content.status) {
            case status.CANCEL:
                return "ban-circle";
            case status.PENDING:
            case status.INPROGRESS:
                return "remove";
            case status.ERROR:
                return content.allowRetry ? "repeat" : "remove";
            case status.COMPLETE:
                return "ok";
            default:
                return "time";
        }
    },
    getCssClass: (contentStatus) => {
        switch (contentStatus) {
            case status.PENDING:
                return "info";
            case status.ERROR:
            case status.CANCEL:
                return "danger";
            case status.INPROGRESS:
                return "warning";
            case status.COMPLETE:
                return "success";
            default:
                return "info";
        }
    },
    uploadContent: () => sinon.spy(),
    cancelUpload: () => sinon.spy(),
    removeContent: () => sinon.spy()
};

describe('FileList', () => {
    it('should render folder', () => {
        const component = renderComponent(ContentRow, { ...props, contentId: '59b913f2b23f6b0013dd3782' }, state);
        expect(component.find(".folder-content")).to.exist;
    });
    it('should render file', () => {
        const component = renderComponent(ContentRow, { ...props, contentId: '59b913f2b23f6b0013dd3789' }, state);
        expect(component.find(".uploaderFolder")).to.exist;
    });
});
