import { expect, should, chai, sinon, fetchMock } from '../test_helper';
import path from 'path';
import apiHelper from '../../../src/app/helpers/apiHelper';
import Config from '../../../config';

const API = Config.get('API');

describe('Api Helper - ', () => {
    describe('Login Test - ', () => {
        it('should return access_token', () => {
            fetchMock.post(API.tokenUrl, () => {
                return {
                    status: 201,
                    body: JSON.stringify({
                        access_token: "eyJhbG",
                        expires_in: 36119,
                        token_type: "Bearer"
                    })
                };
            });
            apiHelper.login({ 'username': 'docmetadata1@mailinator.com', 'password': 'Password1' })
                .then(res => res.json())
                .then(output => {
                    return expect(output).to.have.property('access_token', "eyJhbG");
                });
            fetchMock.restore();
        });

        it('should not return access_token', () => {
            fetchMock.post(API.tokenUrl, () => {
                return { status: 401 };
            });
            apiHelper.login({ 'username': 'docmetadata1@mailinator.com', 'password': '' }).then(response => {
                return expect(response.status).to.equals(401);
            });

            fetchMock.restore();
        });

        it('should regenerate access_token', () => {
            apiHelper.token = 'mytoken';
            apiHelper.refresh_token = 'myrefreshtoken';
            fetchMock.post(API.tokenUrl, () => {
                return {
                    status: 201,
                    body: JSON.stringify({
                        access_token: "eyJhbG",
                        expires_in: 36119,
                        token_type: "Bearer"
                    })
                };
            });
            apiHelper.regenerateAccessToken()
                .then(res => res.json())
                .then(output => {
                    const { token, refresh_token } = output;
                    return expect(token).to.not.equals(apiHelper.token);
                });
            fetchMock.restore();
        });
    });

    it('should return user info', () => {
        fetchMock.get(API.baseUrl + API.currentUser, { response: 200 });
        apiHelper.getUserInfo().then(response => {
            return expect(response.status).to.equals(200);
        });
        fetchMock.restore();
    });
    it('should create content metadata', () => {
        fetchMock.post(API.baseUrl + API.createMetadata.replace(':projectId', "newProject"), { response: 200 });
        let metaData = {
            "fileOperation": "0",
            "name": "dummy",
            "index": "1.1",
            "isplaceholder": "0",
            "parent": "0",
            "type": "F"
        };
        apiHelper.createContentMetadata("newProject", metaData).then(response => {
            expect(response.status).to.equals(200);
        });
        fetchMock.restore();
    });
    it('should update token', () => {
        apiHelper.updateToken('abcdef');
        expect(apiHelper.token).to.equals("abcdef");
    });
    it('should upload content', () => {
        let options = {
            content: {
                projectId: 'myProject',
                filePath: path.join(__dirname, "../../test-data/TestDoc.docx"),
                baseBlobId: '5076564e-77a8-4213-91ad-7a9e9003eabc',
                groupId: '227429e4-659c-486a-9aff-8da899610614',
                id: '59bfad09e2a923000e973838',
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                name: 'EmbeddedSmallFile.xlsx'
            },
            progressCallback: chai.spy(),
            completeCallback: chai.spy(),
            errorCallback: chai.spy()
        };
        expect(options.progressCallback).to.be.spy;
        expect(options.completeCallback).to.be.spy;
        expect(options.errorCallback).to.be.spy;
        var request = apiHelper.uploadContent(options);
    });
    it('should return getFileRoomDetails', () => {
        const fileroomId = "myFileRoom", projectId = "myProject";
        fetchMock.get(API.baseUrl + API.fileroom.replace(":projectId", projectId).concat(`?parentId=${fileroomId}`), { response: 200 });
        apiHelper.getFileRoomDetails(projectId, fileroomId).then(response => {
            return expect(response.status).to.equals(200);
        });
        fetchMock.restore();
    });
    it('should return getFileRoom', () => {
        const projectId = "myProject";
        fetchMock.get(API.baseUrl + API.fileroom.replace(":projectId", projectId), { response: 200 });
        apiHelper.getFileRoom(projectId).then(response => {
            return expect(response.status).to.equals(200);
        });
        fetchMock.restore();
    });
    it('should return getFolders', () => {
        const parentId = "myParent", projectId = "myProject";
        fetchMock.get(API.baseUrl + API.fileroom.replace(":projectId", projectId).concat(`?parentId=${parentId}`), { response: 200 });
        apiHelper.getFolders(projectId, parentId).then(response => {
            return expect(response.status).to.equals(200);
        });
        fetchMock.restore();
    });
    it('should return getFolders with files', () => {
        const parentId = "myParent", projectId = "myProject";
        fetchMock.get(API.baseUrl + API.grid.replace(":projectId", projectId).concat(`?parentId=${parentId}`), { response: 200 });
        apiHelper.getFolders(projectId, parentId, true).then(response => {
            return expect(response.status).to.equals(200);
        });
        fetchMock.restore();
    });
    it('should return createDefaultUploadLocation', () => {
        const data = {}, projectId = "myProject";
        fetchMock.post(API.baseUrl + API.createMetadata.replace(":projectId", projectId), { response: 200 });
        apiHelper.createDefaultUploadLocation(projectId, data).then(response => {
            return expect(response.status).to.equals(200);
        });
        fetchMock.restore();
    });
});
