const devConfig = {
    "app": {
        "defaultRetry": 3,
        "concurrency": 2,
        "notificationTimeOut": 5000,
        "datasiteBasePath": "https://localhost",
        "javlinException": [
            "BLACKLIST",
            "PASSWORD",
            "VIRUS_DETECTED",
            "REJECT_CORRUPT",
            "REJECT_ATTACHMENT",
            "REJECT_OTHER",
            "SYSTEM_ERROR",
            "FORBIDDEN",
            "NONE"
        ]
    },
    "analytics": {
        "gaTrackingID": "googletrackingid",
        "mixPanelTrackingId": "trackingid"
    },
    "API": {
        "tokenUrl": "https://someurl/as/token.oauth2",
        "baseUrl": "https://someurl",
        "project": "/api/v2/users/projects",
        "currentUser": "/api/users/current",
        "createMetadata": "/api/projects/:projectId/metadata/v2/create",
        "deleteMetadata": "/api/projects/:projectId/metadata/v2/delete",
        "fileroom": "/api/projects/:projectId/metadata/v2/tree",
        "grid": "/api/projects/:projectId/metadata/v2/grid",
        "replaceContent": "/api/projects/:projectId/content/replace",
        "uploadContent": "/zuul/api/projects/:projectId/content/upload",
        "dsFolderPath": "/manda/project/:projectId/content/:folderId",
        "createProject": "/api/v2/projects",
        "fileroomHierachy": "/api/projects/:projectId/metadata/v2/search?excludeTrash=true&types=FILEROOM&types=FOLDER&includeAllChildren=true"
    },
    "loginConst": {
        "grant_type": "password",
        "client_id": "iam_api_nu",
        "client_secret": "secret"
    },
    "refreshConst": {
        "grant_type": "refresh_token",
        "client_id": "iam_api_nu",
        "client_secret": "secret"
    },
    "messages": {
        "offline": " - there is no internet connection.",
        "networkError": "Network Error"
    },
    "backtraceRenderedConfig": {
        endpoint: "https://my.backtrace.io:6098",
        token: "b0724bb161d55bc35008d4782676e5e3fcec4388b782f662c519fdb74999675e",
        attributes: {
            'datacenter': 'nyc'
        }
    },
    "appSetting": {
        appHeight: 759,
        appWidth: 720,
        appToolbar: false,
        webURL: 'https://someurl',
        "crashReporter": {
            productName: "desktopUploader",
            companyName: "Arpit Sharma",
            submitURL: "https://my.backtrace.io:6098/post?format=minidump&token=b0724bb161d55bc35008d4782676e5e3fcec4388b782f662c519fdb74999675e",
            uploadToServer: true
        }
    }
};
module.exports = devConfig;
