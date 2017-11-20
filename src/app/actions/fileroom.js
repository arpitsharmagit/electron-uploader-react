const defaultFileRoom = 'QuickDrop';
const defaultFolder = 'DESKTOP';
import { LOGIN_USER, USER_PROFILE, PROJECT_SELECTION, PORJECT_CHANGE, FILEROOM_ERROR_ON, LOADING, LOADING_DONE, FILEROOM_ERROR_OFF, FOLDER_ID, DROP_LOCATION } from "./types";
import helper from '../helpers';
const checkForUploadFileRoom = (fileRooms, name) => {
    let defaultFileRoomId = -1;
    for (let i = 0; i < fileRooms.length; i++) {
        if (fileRooms[i].name === name) {
            defaultFileRoomId = fileRooms[i].id;
            break;
        }
    }
    return defaultFileRoomId;
};
const setDefaultLocationIds = (data, type, dispatch) => {
    switch (type) {
        case "ALL":
            for (let i = 0; i < data.length; i++) {
                if (data[i].name === defaultFolder) {
                    dispatch({ type: FOLDER_ID, payload: data[i].id });
                    dispatch({ type: LOADING_DONE });
                    dispatch({ type: FILEROOM_ERROR_OFF });
                    break;
                }
            }
            break;
        case "FOLDER":
            dispatch({ type: FOLDER_ID, payload: data });
            dispatch({ type: LOADING_DONE });
            dispatch({ type: FILEROOM_ERROR_OFF });
            break;
        default:
            break;
    }
};
const processDefaultSchemaDesktop = (defaultFileRoomId, projectId, parentId, emailAddress, dispatch) => {
    if (defaultFileRoomId === -1) {
        let schema = {
            "content": [{
                "children": [],
                "correlationId": "1",
                "name": defaultFolder,
                "published": true,
                "type": "FOLDER"
            }],
            "parentId": parentId
        };
        helper.apiHelper.createDefaultUploadLocation(projectId, schema).then((response) => {
            if (response.status !== 201) {
                return "ERROR";
            }
            return response.json();
        }).then((response) => {
            if (response !== "ERROR") {
                setDefaultLocationIds(response.contents, "ALL", dispatch);
            } else {
                dispatch({ type: FILEROOM_ERROR_ON });
                dispatch({ type: LOADING_DONE });
            }
        }).catch((ex) => {
            dispatch({ type: FILEROOM_ERROR_ON });
            dispatch({ type: LOADING_DONE });
        });
    }
    else {
        setDefaultLocationIds(defaultFileRoomId, "FOLDER", dispatch);
    }
};
const getChildContentFolder = (defaultFileRoomId, emailAddress, projectId, dispatch) => {
    return helper.apiHelper.getFolders(projectId, defaultFileRoomId).then((response) => {
        if (response.status === 200) {
            return response.json();
        }
        return "ERROR";
    }).then((fileRooms) => {
        if (fileRooms && fileRooms !== "ERROR") {
            let defaultFolderId = checkForUploadFileRoom(fileRooms.children, defaultFolder);
            return processDefaultSchemaDesktop(defaultFolderId, projectId,
                defaultFileRoomId, emailAddress, dispatch);
        }
        throw new Error("Unable to load fileRooms");
    }).catch((e) => {
        dispatch({ type: FILEROOM_ERROR_ON });
        dispatch({ type: LOADING_DONE });
    });
};


const processDefaultSchemaFolder = (defaultFileRoomId, projectId, parentId, emailAddress, dispatch, getState) => {
    if (defaultFileRoomId === -1) {
        let schema = {
            "content": [{
                "children": [
                    {
                        "active": true,
                        "name": defaultFolder,
                        "correlationId": "1.1",
                        "type": "FOLDER"
                    }
                ],
                "correlationId": "1",
                "name": emailAddress,
                "published": true,
                "type": "FOLDER"
            }],
            "parentId": parentId
        };
        return helper.apiHelper.createDefaultUploadLocation(projectId, schema).then((response) => {
            if (response.status !== 201) {
                return "ERROR";
            }
            return response.json();
        }).then((response) => {
            if (response !== "ERROR") {
                dispatch({ type: LOADING_DONE });
                dispatch({ type: FILEROOM_ERROR_OFF });
                setDefaultLocationIds(response.contents, "ALL", dispatch);
            } else {
                dispatch({ type: LOADING_DONE });
                dispatch({ type: FILEROOM_ERROR_ON });
            }
        }).catch((ex) => {
            dispatch({ type: LOADING_DONE });
            dispatch({ type: FILEROOM_ERROR_ON });
        });
    }
    return getChildContentFolder(defaultFileRoomId, emailAddress, projectId, dispatch);
};
const getChildContent = (defaultFileRoomId, emailAddress, projectId, dispatch) => {
    return helper.apiHelper.getFolders(projectId, defaultFileRoomId).then((response) => {
        if (response.status === 200) {
            return response.json();
        }
        return "ERROR";
    })
        .then((fileRooms) => {
            if (fileRooms && fileRooms !== "ERROR") {
                let defaultFolderId = checkForUploadFileRoom(fileRooms.children, emailAddress);
                return processDefaultSchemaFolder(defaultFolderId, projectId,
                    defaultFileRoomId, emailAddress, dispatch);
            }
            throw new Error("Unable to load fileRooms");
        }).catch((e) => {
            dispatch({ type: FILEROOM_ERROR_ON });
            dispatch({ type: LOADING_DONE });
        });
};

const processDefaultSchema = (defaultFileRoomId, projectId, dispatch, getState) => {
    const { firstName, lastName} = getState().user.profile;
    const emailAddress = `${firstName} ${lastName}`;
    if (defaultFileRoomId === -1) {
        let schema = {
            "content": [{
                "children": [
                    {
                        "active": true,
                        "children": [
                            {
                                "active": true,
                                "children": [],
                                "name": defaultFolder,
                                "correlationId": "1.1.1",
                                "type": "FOLDER"
                            }
                        ],
                        "name": emailAddress,
                        "correlationId": "1.1",
                        "type": "FOLDER"
                    }
                ],
                "correlationId": "1",
                "name": defaultFileRoom,
                "published": true,
                "type": "FILEROOM"
            }],
            "count": 0
        };
        return helper.apiHelper.createDefaultUploadLocation(projectId, schema).then((response) => {
            if (response.status !== 201) {
                return "ERROR";
            }
            return response.json();
        }).then((response) => {
            if (response !== "ERROR") {
                dispatch({ type: LOADING_DONE });
                dispatch({ type: FILEROOM_ERROR_OFF });
                setDefaultLocationIds(response.contents, "ALL", dispatch);
            } else {
                dispatch({ type: FILEROOM_ERROR_ON });
                dispatch({ type: LOADING_DONE });
            }
        }).catch((ex) => {
            dispatch({ type: FILEROOM_ERROR_ON });
            dispatch({ type: LOADING_DONE });
        });
    }
    return getChildContent(defaultFileRoomId, emailAddress, projectId, dispatch);
};

function getFileRoom(project, dispatch, getState) {
    const projectId = project.projectId;
    return helper.apiHelper.getFileRoom(projectId).then((response) => {
        if (response.status === 200) {
            return response.json();
        }
        return "ERROR";
    })
        .then((fileRooms) => {
            if (fileRooms && fileRooms !== "ERROR") {
                let defaultFileRoomId = checkForUploadFileRoom(fileRooms.children, defaultFileRoom);
                return processDefaultSchema(defaultFileRoomId, projectId, dispatch, getState);
            }
            throw new Error("Unable to load fileRooms");
        }).catch((e) => {
            dispatch({ type: FILEROOM_ERROR_ON });
            dispatch({ type: LOADING_DONE });
        });
}
export function selectProject(project) {
    return (dispatch, getState) => {
        dispatch({ type: PROJECT_SELECTION, payload: project, isUpload: true });
        dispatch({ type: LOADING });
        return getFileRoom(project, dispatch, getState);
    };
}
export function switchDropLocation(isMyFolders) {
    return {
        type: DROP_LOCATION,
        payload: isMyFolders
    };
}
