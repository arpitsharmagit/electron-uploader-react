/* eslint no-use-before-define: [1, 'nofunc'] */
import * as types from "./types";
import * as notification from "./notification";
import apihelper from '../helpers/apiHelper';
import status from '../helpers/constants';
import * as utility from '../helpers/sharedFunctions';
import uploadQueue from '../helpers/uploadQueue';
import config from '../../../config';
import fs from 'fs';
import path from 'path';
import * as networkAction from './network';
const appConfig = config.get('app');
let index = 1;

const FAILED_REASONS = appConfig.javlinException;
const FAILED_WITH_RETRY = "Upload Failed. / Click icon to retry.";
const FAILED_WITH_ERROR = "Upload Failed. ";

export function filter(filterStatus) {
    return {
        type: types.FILTER_LIST,
        payload: filterStatus,
        isUpload: true
    };
}
export function updateProgress(progressData, contentId) {
    return {
        type: types.UPDATE_PROGRESS,
        payload: { contentId, ...progressData },
        isUpload: true
    };
}

export function uploadFinished(eventData, contentId) {
    return {
        type: types.UPLOAD_COMPLETE,
        payload: { contentId },
        isUpload: true
    };
}

export function uploadFailed(message, error, allowRetry, contentId) {
    return {
        type: types.UPLOAD_FAILED,
        payload: { contentId, message, error, allowRetry },
        isUpload: true
    };
}
export function removeUpload(contentId) {
    return {
        type: types.CLEAR_LIST,
        payload: [contentId],
        isUpload: true
    };
}
export function cancelUpload(contentId) {
    return (dispatch, getState) => {
        let uploadRequest = null;
        const state = getState();
        const content = state.upload.uploadList[contentId];
        if (content) {
            uploadQueue.jobComplete(content.id);
            content.uploadTask && content.uploadTask.abort();
            dispatch({
                type: types.CANCEL_UPLOAD,
                payload: { contentId },
                isUpload: true
            });
        }
    };
}
export function queueFinished(contentId) {
    return (dispatch, getState) => {
        const state = getState();
        const content = state.upload.uploadList[contentId];
        if (content) {
            const stats = state.upload.stats[content.projectId];
            if (uploadQueue.failed.size) {
                dispatch(notification.showToast(contentId, "Failed Uploads", `${uploadQueue.failed.size} files failed to uploaded .`, "error"));
            }
            if (uploadQueue.success.size) {
                dispatch(notification.showToast(contentId, "Upload Complete", `${uploadQueue.success.size} files uploaded successfully.`, "success"));
            }
            uploadQueue.totol.clear();
            uploadQueue.success.clear();
            uploadQueue.failed.clear();
        }
    };
}
export function clearList(statusToRemove) {
    return (dispatch, getState) => {
        const state = getState();
        let contentToClear = [];
        const unClearableStatuses = [status.INPROGRESS, status.PENDING];
        const uploadList = state.upload.uploadList;
        const projectUploadKeys = Object.keys(uploadList)
            .filter(k => uploadList[k].projectId === state.user.project.projectId);
        const allfilescantberemoved = [], allfilesRemovable = [], allfolders = [];
        if (statusToRemove) {
            projectUploadKeys.forEach(key => {
                const content = uploadList[key];
                if (content.type === "DOCUMENT" && statusToRemove !== content.status) {
                    allfilescantberemoved.push(content.displayIndex);
                }
                if (content.type === "DOCUMENT" && statusToRemove === content.status) {
                    allfilesRemovable.push(content.displayIndex);
                    contentToClear.push(content.id);
                }
                if (content.type === "FOLDER") {
                    allfolders.push(content);
                }
            });
            allfolders.forEach(key => {
                let canRemove = true;
                for (let i = 0; i < allfilescantberemoved.length; i++) {
                    if (allfilescantberemoved[i].indexOf(key.displayIndex) === 0) {
                        canRemove = false;
                        break;
                    }
                }
                if (canRemove) {
                    contentToClear.push(key.id);
                }
            });
        }
        else {
            projectUploadKeys.forEach(key => {
                const content = uploadList[key];
                if (content.type === "DOCUMENT" && !unClearableStatuses.includes(content.status)) {
                    contentToClear.push(content.id);
                }
                if (content.type === "FOLDER") {
                    const unclearableChild = projectUploadKeys
                        .filter(u => (uploadList[u].parentId === content.id &&
                            unClearableStatuses.includes(uploadList[u].status) && uploadList[u].type === "DOCUMENT"
                        ));
                    if (unclearableChild.length === 0) {
                        contentToClear.push(content.id);
                    }
                }
            });
        }
        dispatch({
            type: types.CLEAR_LIST,
            payload: contentToClear,
            isUpload: true
        });
    };
}
export function uploadContent(contentId, isRetry) {
    return (dispatch, getState) => {
        let uploadRequest = null;
        const state = getState();
        const content = state.upload.uploadList[contentId];
        if (content && content.allowRetry) {
            uploadRequest = apihelper.uploadContent({
                content,
                "progressCallback": (e) => {
                    const loaded = utility.bytesToSize(e.loaded),
                        percentage = Math.round(e.loaded / (e.total ? e.total : 1) * 100),
                        total = utility.bytesToSize(e.total);
                    dispatch(updateProgress({ loaded, total, percentage }, content.id));
                },
                "completeCallback": (e) => {
                    dispatch(uploadFinished(e, content.id));
                    uploadQueue.jobComplete(content.id, status.COMPLETE);
                },
                "errorCallback": (e) => {
                    let allowRetry = true;
                    let message = FAILED_WITH_RETRY;
                    let error = "";
                    if (e.statusCode) {
                        if (e.body && utility.IsJsonString(e.body)) {
                            const failedReason = JSON.parse(e.body).message;
                            if (FAILED_REASONS.includes(failedReason)) {
                                allowRetry = false;
                                message = FAILED_WITH_ERROR + ` / Invalid Content: ${failedReason}`;
                                error = `Server Error : ${e.statusCode} ${e.statusMessage} ${e.javlinException}`;
                            }
                            // dont allow retry on server error
                        }
                        dispatch(uploadFailed(message, error, allowRetry, content.id));
                    }
                    else if (e instanceof Error) {
                        if (e.code === 'ECONNRESET' || e.code === "ETIMEDOUT" || e.code === "ESOCKETTIMEDOUT") {
                            allowRetry = true;
                            message = FAILED_WITH_ERROR + `Network Error: ${e.code} . Click icon to retry.`;
                        }

                        dispatch(uploadFailed(message, `${e.name} : ${e.code} ${e.message} ${e.stack}`, allowRetry, content.id));
                    }
                    else {
                        dispatch(uploadFailed(message, `Error : ${JSON.stringify(e)}`, allowRetry, content.id));
                    }
                    uploadQueue.jobComplete(content.id, status.ERROR);
                    if (content.attempts < appConfig.defaultRetry && allowRetry) {
                        setTimeout(function () { dispatch(uploadContent(content.id)); }, 5000);
                    }
                }
            });
            dispatch({
                type: types.UPLOAD_START,
                payload: { contentId, uploadRequest, isRetry },
                isUpload: true
            });
        }
        else {
            uploadQueue.jobComplete(contentId);
            // todo: Content not found
            let allowRetry = false, error = "", message = "";
            if (!content) {
                message = "File not found.";
            }
            else if (!content.allowRetry) {
                message = content.message;
                error = content.error;
            }
            dispatch(uploadFailed(message, error, allowRetry, contentId));
        }
    };
}
const addFile = (metadata, itemType, item, itemIndex) => {
    let _item = {
        "active": true,
        "name": item.name,
        "correlationId": itemIndex,
        "type": itemType,
        "published": false
    };
    if (itemType === "DOCUMENT") {
        Object.defineProperty(_item, 'item', {
            enumerable: false,
            configurable: false,
            writable: true,
            value: item
        });
    }
    metadata.push(_item);
    return _item;
};
function readEntryFromDirectory(dirReader, item, itemIndex, iterator, metadata) {
    dirReader.readEntries(function (entries) {
        if (entries.length === 0) {
            iterator.totalReadCursor--;
            if (iterator.totalReadCursor === 0) {
                iterator.callBack();
            }
            return;
        }
        for (let i = 0; i < entries.length; i++) {
            traverseFileTree(entries[i], itemIndex + "." + (i + 1), iterator, metadata);
        }
        readEntryFromDirectory(dirReader, item, index, iterator, metadata);
    });
}

function traverseSchema(data, files, fileUploadList, projectId, parentId, depth = 0) {
    const documentArray = [];
    for (let i = 0; i < data.length; i++) {
        const filedata = data[i];
        const currentFile = files.find((f) => f.correlationId === data[i].correlationId);
        let currentDocument = Object.assign({}, currentFile,
            {
                "projectId": projectId,
                "parentId": parentId,
                "status": -1,
                "progress": 0,
                "attempts": 0,
                "allowRetry": true,
                "bytesMessage": "",
                "message": "Uploading...",
                "error": ""
            });
        if (currentFile.type === "DOCUMENT") {
            currentDocument.name = path.basename(filedata.item.path);
            currentDocument.filePath = filedata.item.path;
            currentDocument.contentType = filedata.item.type;
            currentDocument.status = status.PENDING;
            currentDocument.isRoot = depth === 0;
            fileUploadList[currentFile.id] = currentDocument;
            filedata.item = null;
        } else {
            // add to directory array
            documentArray.push({ filedata, depth, "id": currentFile.id, currentDocument });
        }
    }
    if (documentArray.length > 0) {
        documentArray.forEach((doc) => {
            doc.currentDocument.depth = doc.depth;
            fileUploadList[doc.id] = doc.currentDocument;
            traverseSchema(doc.filedata.children, files, fileUploadList, projectId, doc.id, (doc.depth + 1));
        });
    }
}

function traverseFileTree(item, itemIndex, iterator, metadata) {
    if (item) {
        iterator.totalReadCursor++;
        if (item.isFile) {
            item.file(function (file) {
                iterator.totalReadCursor--;
                // TODO get list of blacklisted files
                if (file.name.indexOf(".DS_Store") === -1) { addFile(metadata, "DOCUMENT", file, itemIndex); }
                if (iterator.totalReadCursor === 0) {
                    iterator.callBack();
                }
            });
        } else if (item.isDirectory) {
            var folder = addFile(metadata, "FOLDER", item, itemIndex);
            folder.children = [];
            var dirReader = item.createReader();
            readEntryFromDirectory(dirReader, item, itemIndex, iterator, folder.children);
        }
    }
}

function metadataAPICall(projectId, data, dispatch) {
    return apihelper.createContentMetadata(projectId, data)
        .then((response) => {
            dispatch(networkAction.changeAPICallingStatus(false));
            if (response.status !== 201) {
                // TODO handle server responses
                dispatch(notification.showToast(projectId, "Server Error", `Failed to dispatch upload request`, "error"));
                // dispatch({ type: types.SERVER_ERROR, isUpload: true, payload: { messaage: '' } });
            }
            return response.json();
        }).then((output) => {
            if (output && output.contents) {
                let fileUploadList = {};
                const files = output.contents;
                traverseSchema(data.content, files, fileUploadList, projectId, data.parentId, 0);
                dispatch({ type: types.CREATE_METADATA, payload: fileUploadList, isUpload: true });
                dispatch(notification.showToast(projectId, "Upload Started", `Content has been added to upload queue!`, "success"));
                Object.keys(fileUploadList).map((key) => {
                    let content = fileUploadList[key];
                    content.type === "DOCUMENT" && uploadQueue.add(dispatch, key);
                });
            }
        })
        .catch((e) => {
            dispatch(notification.showToast(projectId, "Server Error", `No response from Server.`, "error"));
            // dispatch({ type: types.SERVER_ERROR, isUpload: true, payload: {} });
        });
}

export function createMetadata(projectId, parentId, files, isfromPicker) {
    return (dispatch, getState) => {
        let schema = {
            "content": [],
            "published": false,
            "projectId": projectId,
            "parentId": parentId
        };
        let metadata = schema.content;
        var iterator = {
            totalReadCursor: 0,
            callBack: () => {
                metadataAPICall(projectId, schema, dispatch);
            }
        };
        files.length > 0 && dispatch(networkAction.changeAPICallingStatus(true));
        for (let i = 0; i < files.length; i++) {
            var item;
            if (isfromPicker) {
                item = files[i];
            } else {
                item = files[i].webkitGetAsEntry();
            }
            const _index = (index++) + "." + (i + 1);
            if (!isfromPicker) {
                traverseFileTree(item, _index, iterator, metadata);
            } else {
                addFile(metadata, "DOCUMENT", item, _index);
            }
        }
        if (isfromPicker) {
            return metadataAPICall(projectId, schema, dispatch);
        }
        return null;
    };
}
