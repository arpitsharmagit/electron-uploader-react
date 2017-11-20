import * as types from "../actions/types";
import status from '../helpers/constants';
import update from 'immutability-helper';
import config from '../../../config';
import { ipcRenderer } from 'electron';

const appConfig = config.get('app');
const status4totalProgress = [status.COMPLETE, status.INPROGRESS];
const defaultState = {
    Notifications: [],
    filterStatus: "",
    stats: {},
    uploadList: {}
};
const SUCCESS_MESSAGE = "Successfully Uploaded";

const sendIPCevent = (data) => {
    ipcRenderer && ipcRenderer.send("tray-event-upload", data);
};
export default function upload(state, action) {
    state = state || defaultState;
    if (action.isUpload) {
        const { contentId, isRetry } = action.payload;
        const content = state.uploadList[contentId];
        switch (action.type) {
            case types.LOGIN_USER:
                return defaultState;
            case types.PROJECT_SELECTION:
                const projectId = action.payload.projectId;
                const projectStats = state.stats[projectId];
                if (projectId && !projectStats) {
                    const projStats = {
                        [projectId]: {
                            countPending: 0,
                            countProgress: 0,
                            countFailed: 0,
                            countCompleted: 0,
                            countCancelled: 0,
                            countTotal: 0,
                            overallProgress: 0
                        }
                    };
                    return update(state, {
                        stats: { $merge: projStats }
                    });
                }
                return state;
            case types.FILTER_LIST:
                return update(state, {
                    filterStatus: { $set: action.payload }
                });
            case types.CREATE_METADATA:
                const mergedState = update(state, {
                    uploadList: { $merge: action.payload }
                });
                sendIPCevent({
                    type: "FILEADD",
                    count: Object.keys(action.payload).filter((i) => action.payload[i].type === "DOCUMENT").length
                });
                const contentProjectId = Object.keys(action.payload)
                    .filter((i) => action.payload[i].type === "DOCUMENT")
                    .map(p => action.payload[p].projectId)[0];
                if (contentProjectId) {
                    const countTotal = Object.keys(mergedState.uploadList).filter((i) =>
                        mergedState.uploadList[i].projectId === contentProjectId &&
                        mergedState.uploadList[i].type === "DOCUMENT"
                    ).length;
                    return update(mergedState, {
                        stats: {
                            [contentProjectId]: { countTotal: { $set: countTotal } }
                        }
                    });
                }
                return mergedState;
            case types.UPDATE_PROGRESS:
                if (content) {
                    const { percentage, loaded, total } = action.payload;
                    const newState = update(state, {
                        uploadList: { [contentId]: { "progress": { $set: percentage }, "message": { $set: ` ${loaded} of ${total}` } } }
                    });
                    const uploadList = newState.uploadList;
                    const keys = Object.keys(uploadList).filter((i) =>
                        uploadList[i].type === "DOCUMENT" &&
                        uploadList[i].projectId === content.projectId
                        && status4totalProgress.includes(uploadList[i].status));
                    const sumProgress = keys.map((key) => uploadList[key].progress).reduce((a, b) => a + b, 0);
                    const overallProgress = Math.round(sumProgress / (keys.length ? keys.length : 1));
                    return update(newState, { stats: { [content.projectId]: { "overallProgress": { $set: overallProgress } } } });
                }
                return state;
            case types.UPLOAD_COMPLETE:
                if (content) {
                    const successState = update(state, {
                        uploadList: {
                            [contentId]: {
                                status: { $set: status.COMPLETE },
                                message: { $set: SUCCESS_MESSAGE }
                            }
                        }
                    });
                    const countCompleted = Object.keys(successState.uploadList).filter((i) =>
                        successState.uploadList[i].status === status.COMPLETE &&
                        successState.uploadList[i].projectId === content.projectId
                    ).length;
                    const countProgress = Object.keys(successState.uploadList)
                        .filter((i) => successState.uploadList[i].status === status.INPROGRESS).length;
                    const uploadList = successState.uploadList;
                    const keys = Object.keys(uploadList).filter((i) =>
                        uploadList[i].type === "DOCUMENT" &&
                        uploadList[i].projectId === content.projectId
                        && status4totalProgress.includes(uploadList[i].status));
                    const sumProgress = keys.map((key) => uploadList[key].progress).reduce((a, b) => a + b, 0);
                    const overallProgress = Math.round(sumProgress / (keys.length ? keys.length : 1));
                    sendIPCevent({
                        type: "UPLOAD_COMPLETE"
                    });
                    return update(successState, {
                        stats: {
                            [content.projectId]: {
                                countCompleted: { $set: countCompleted },
                                countProgress: { $set: countProgress },
                                overallProgress: { $set: overallProgress }
                            }
                        }
                    });
                }
                return state;
            case types.UPLOAD_START:
                if (content) {
                    isRetry && sendIPCevent({
                        type: "UPLOAD_RETRY"
                    });
                    const progressState = update(state, {
                        uploadList: {
                            [contentId]: {
                                attempts: { $set: ++state.uploadList[contentId].attempts },
                                status: { $set: status.INPROGRESS },
                                progress: { $set: 0 },
                                message: { $set: "Uploading..." },
                                uploadTask: { $set: action.payload.uploadRequest },
                                error: { $set: "" }
                            }
                        }
                    });
                    const countFailed = Object.keys(progressState.uploadList).filter((i) =>
                    progressState.uploadList[i].status === status.ERROR &&
                    progressState.uploadList[i].projectId === content.projectId
                ).length;
                    const countProgress = Object.keys(progressState.uploadList).filter((i) =>
                        progressState.uploadList[i].status === status.INPROGRESS &&
                        progressState.uploadList[i].projectId === content.projectId
                    ).length;
                    const countPending = Object.keys(progressState.uploadList).filter((i) =>
                        progressState.uploadList[i].status === status.PENDING &&
                        progressState.uploadList[i].projectId === content.projectId
                    ).length;
                    return update(progressState, {
                        stats: {
                            [content.projectId]: {
                                countFailed: { $set: countFailed },
                                countPending: { $set: countPending },
                                countProgress: { $set: countProgress }
                            }
                        }
                    });
                }
                return state;
            case types.UPLOAD_FAILED:
                if (content) {
                    let statusToUpdate = status.INPROGRESS;
                    const { message, error, allowRetry } = action.payload;
                    (!allowRetry || (content.attempts >= appConfig.defaultRetry && allowRetry))
                        && sendIPCevent({
                            type: "UPLOAD_FAILED"
                        });
                    (!allowRetry || (content.attempts >= appConfig.defaultRetry && allowRetry)) &&
                        (statusToUpdate = status.ERROR);
                    const failedState = update(state, {
                        uploadList: {
                            [contentId]: {
                                status: { $set: statusToUpdate },
                                allowRetry: { $set: allowRetry },
                                progress: { $set: 0 },
                                message: { $set: message },
                                error: { $set: error }
                            }
                        }
                    });
                    const countFailed = Object.keys(failedState.uploadList).filter((i) =>
                        failedState.uploadList[i].status === status.ERROR &&
                        failedState.uploadList[i].projectId === content.projectId
                    ).length;
                    const countProgress = Object.keys(failedState.uploadList)
                        .filter((i) => failedState.uploadList[i].status === status.INPROGRESS).length;
                    const uploadList = failedState.uploadList;
                    const keys = Object.keys(uploadList).filter((i) =>
                        uploadList[i].type === "DOCUMENT" &&
                        uploadList[i].projectId === content.projectId
                        && status4totalProgress.includes(uploadList[i].status));
                    const sumProgress = keys.map((key) => uploadList[key].progress).reduce((a, b) => a + b, 0);
                    const overallProgress = Math.round(sumProgress / (keys.length ? keys.length : 1));
                    return update(failedState, {
                        stats: {
                            [content.projectId]: {
                                countFailed: { $set: countFailed },
                                countProgress: { $set: countProgress },
                                overallProgress: { $set: overallProgress }
                            }
                        }
                    });
                }
                return state;
            case types.CANCEL_UPLOAD:
                if (content) {
                    sendIPCevent({
                        type: "UPLOAD_CANCEL"
                    });
                    const cancelState = update(state, {
                        uploadList: {
                            [contentId]: {
                                status: { $set: status.CANCEL },
                                progress: { $set: 0 },
                                message: { $set: "Cancelled." }
                            }
                        }
                    });
                    const countCancelled = Object.keys(cancelState.uploadList).filter((i) =>
                        cancelState.uploadList[i].status === status.CANCEL &&
                        cancelState.uploadList[i].projectId === content.projectId
                    ).length;
                    const countFailed = Object.keys(cancelState.uploadList).filter((i) =>
                        cancelState.uploadList[i].status === status.ERROR &&
                        cancelState.uploadList[i].projectId === content.projectId
                    ).length;
                    const countProgress = Object.keys(cancelState.uploadList)
                        .filter((i) => cancelState.uploadList[i].status === status.INPROGRESS).length;
                    const keys = Object.keys(cancelState.uploadList).filter((i) =>
                        cancelState.uploadList[i].type === "DOCUMENT" &&
                        cancelState.uploadList[i].projectId === content.projectId
                        && status4totalProgress.includes(cancelState.uploadList[i].status));
                    const sumProgress = keys.map((key) => cancelState.uploadList[key].progress)
                        .reduce((a, b) => a + b, 0);
                    const overallProgress = Math.round(sumProgress / (keys.length ? keys.length : 1));
                    return update(cancelState, {
                        stats: {
                            [content.projectId]: {
                                countCancelled: { $set: countCancelled },
                                countProgress: { $set: countProgress },
                                countFailed: { $set: countFailed },
                                "overallProgress": { $set: overallProgress }
                            }
                        }
                    });
                }
                return state;
            case types.CLEAR_LIST:
                const id = action.payload[0];
                if (id) {
                    const clearProjectId = state.uploadList[id].projectId;
                    const clearState = update(state, {
                        uploadList: { $unset: action.payload }
                    });

                    const projectKeys = Object.keys(clearState.uploadList)
                        .filter((i) => clearState.uploadList[i].projectId === clearProjectId &&
                            clearState.uploadList[i].type === "DOCUMENT");
                    const countPending = projectKeys
                        .filter((i) => clearState.uploadList[i].status === status.PENDING).length;
                    const countProgress = projectKeys
                        .filter((i) => clearState.uploadList[i].status === status.INPROGRESS).length;
                    const countFailed = projectKeys
                        .filter((i) => clearState.uploadList[i].status === status.ERROR).length;
                    const countCompleted = projectKeys
                        .filter((i) => clearState.uploadList[i].status === status.COMPLETE).length;
                    const countCancelled = projectKeys
                        .filter((i) => clearState.uploadList[i].status === status.CANCEL).length;
                    return update(clearState, {
                        stats: {
                            [clearProjectId]: {
                                countPending: { $set: countPending },
                                countProgress: { $set: countProgress },
                                countFailed: { $set: countFailed },
                                countCompleted: { $set: countCompleted },
                                countCancelled: { $set: countCancelled },
                                countTotal: { $set: projectKeys.length }
                            }
                        }
                    });
                }
                return state;
            default:
                return state;
        }
    }
    return state;
}
