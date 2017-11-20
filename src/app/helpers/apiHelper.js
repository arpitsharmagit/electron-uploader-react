import config from '../../../config';
import path from 'path';
import { debounce, throttle } from 'lodash';
import status from './constants';
import * as utility from './sharedFunctions';
import fs from 'fs';
import request from 'request';
import * as HttpStatus from 'http-status-codes';
const refreshTokenConstants = config.get('refreshConst');
const API = config.get('API');

class APIHelper {
    constructor() {
        this.token = '';
        this.refresh_token = '';
        this.defaultHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }
    regenerateAccessToken() {
        let nuRefreshToken = this.refresh_token;
        let formData = { ...refreshTokenConstants, refresh_token: nuRefreshToken };
        const body = Object.keys(formData).reduce(function (previous, current) {
            return previous + (!previous ? '' : '&') + encodeURIComponent(current) + "=" + encodeURIComponent(formData[current]);
        }, "");
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        let options = {
            'url': API.tokenUrl,
            'method': 'POST',
            'headers': headers,
            'data': body
        };
        return this.apiRequest(options, true);
    }
    apiRequest(options, isRefresh) {
        let { url, method, data, headers } = options;
        if (!/^[a-z][a-z0-9+.-]*:/.test(url)) { // is Url absolute
            url = API.baseUrl + url;
        }
        let hd = Object.assign({}, this.defaultHeaders, headers, { 'Authorization': 'Bearer ' + this.token });
        isRefresh && delete hd.Authorization;
        return fetch(url, {
            method: method || "GET",
            headers: hd,
            body: data
        }).then((res) => {
            if (res.status === HttpStatus.UNAUTHORIZED && window.localStorage.getItem('keepmelogin') === "true") {
                return this.regenerateAccessToken().then((response) => {
                    return response.json();
                }).then((refreshTokenResponse) => {
                    if (refreshTokenResponse.access_token && refreshTokenResponse.refresh_token) {
                        this.token = refreshTokenResponse.access_token;
                        this.refresh_token = refreshTokenResponse.refresh_token;
                        return this.apiRequest(options);
                    }
                    return res;
                    // TODO: redirect to login
                });
            }
            return res;
        });
    }
    updateToken(token, refresh_token) {
        this.token = token;
        this.refresh_token = refresh_token;
    }
    login(data) {
        let loginData = {
            'username': data.userName,
            'password': data.password
        };
        let formData = Object.assign({}, config.get("loginConst"), loginData);
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const body = Object.keys(formData).reduce(function (previous, current) {
            return previous + (!previous ? '' : '&') + encodeURIComponent(current) + "=" + encodeURIComponent(formData[current]);
        }, "");

        let options = {
            'url': API.tokenUrl,
            'method': 'POST',
            'headers': headers,
            'data': body
        };
        return this.apiRequest(options);
    }
    getUserInfo() {
        return this.apiRequest({ 'url': API.currentUser, 'method': 'GET' });
    }

    // createProject(data){
    //     return this.apiRequest({ url: API.createProject, method: "POST", data: JSON.stringify(data) });
    // }

    createContentMetadata(projectId, metadata) {
        const options = {
            'url': API.createMetadata.replace(':projectId', projectId),
            'method': 'POST',
            'data': JSON.stringify(metadata)
        };
        return this.apiRequest(options);
    }
    uploadContent(options) {
        const { content, progressCallback, completeCallback, errorCallback } = options;
        const url = API.baseUrl + API.uploadContent.replace(':projectId', content.projectId);
        try {
            const fileStream = fs.createReadStream(content.filePath);
            const filesize = fs.lstatSync(content.filePath).size;
            const headers = { 'Authorization': `Bearer ${this.token}` };
            const formData = {
                docId: content.baseBlobId,
                groupId: content.groupId,
                metadataId: content.id,
                file: {
                    value: fileStream,
                    options: {
                        filename: path.basename(content.filePath),
                        contentType: content.contentType
                    }
                }
            };
            const req = request.post({ url, formData, timeout: 15000, headers }, function (error, response, body) {
                if (error) {
                    errorCallback(error);
                    return;
                }
                if (response && response.statusCode === 201) {
                    completeCallback(response.statusCode);
                    return;
                }
                if (response && response.statusCode !== 201) {
                    response.body = body;
                    errorCallback(response);
                    return;
                }
                errorCallback(response);
            });
            req.on('response', (response) => {
                progressCallback({
                    loaded: req.req.connection._bytesDispatched,
                    total: filesize,
                    percentage: Math.round(req.req.connection._bytesDispatched / filesize * 100)
                });
            });
            req.on('drain', () => {
                if (content.status === status.CANCEL) {
                    req.abort();
                }
                progressCallback({
                    loaded: req.req.connection._bytesDispatched,
                    total: filesize,
                    percentage: Math.round(req.req.connection._bytesDispatched / filesize * 100)
                });
            });
            req.on('end', () => {
                const loaded = req.req.connection._bytesDispatched;
                const total = req.req.connection._bytesDispatched > filesize ?
                    req.req.connection._bytesDispatched : filesize;
                progressCallback({
                    loaded,
                    total,
                    percentage: Math.round(loaded / total * 100)
                });
            });
            return req;
        } catch (err) {
            return null;
        }
    }
    getFileRoomDetails(projectId, fileroomId) {
        let fileroomUrl = API.fileroom.replace(":projectId", projectId);
        if (fileroomId) {
            fileroomUrl += `?parentId=${fileroomId}`;
        }
        const options = {
            'url': fileroomUrl,
            'method': 'GET'
        };
        return this.apiRequest(options);
    }
    getFileRoom(projectId) {
        const fileRoomURL = API.fileroom.replace(":projectId", projectId);
        const options = {
            'url': fileRoomURL,
            'method': 'GET'
        };
        return this.apiRequest(options);
    }
    getFolders(projectId, parenetId, isShowFiles) {
        const fileRoomURL = isShowFiles ?
            API.grid.replace(":projectId", projectId) + `?parentId=${parenetId}` :
            API.fileroom.replace(":projectId", projectId) + `?parentId=${parenetId}`;
        return this.apiRequest({ url: fileRoomURL, 'method': 'GET' });
    }
    createDefaultUploadLocation(projectId, data) {
        const metadataCreateURL = API.createMetadata.replace(":projectId", projectId);
        return this.apiRequest({ url: metadataCreateURL, method: "POST", data: JSON.stringify(data) });
    }
    getAllFileRoomsAndFolder(projectId) {
        const allFileRoomAndFoldersURL = API.fileroomHierachy.replace(":projectId", projectId);
        return this.apiRequest({ url: allFileRoomAndFoldersURL, method: "GET" });
    }
}
export default new APIHelper();
