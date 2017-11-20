const devConfig = require('./dev.config');
const stageConfig = require('./stage.config');
let _config = null;
switch (process.env.RELEASE_ENV) {
    case 'STAGE':
        _config = stageConfig;
        break;
    default:
        _config = devConfig;
}
class Config {
    get(key) {
        return _config[key];
    }
}
module.exports = new Config();
