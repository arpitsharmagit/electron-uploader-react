var yaml = require('write-yaml');
const devSetup = require('./setup.dev.json');
const stageSetup = require('./setup.stage.json');
var data = process.env.RELEASE_ENV === "STAGE" ? stageSetup : devSetup;
yaml('dev-app-update.yml', data, function (err) {
    if (err) {
        throw err;
    }
});
