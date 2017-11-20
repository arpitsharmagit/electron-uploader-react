import { expect } from '../test_helper';
import devConfig from '../../../config/dev.config';
import satgeConfig from '../../../config/dev.config';
import configDev from '../../../config';
process.env.RELEASE_ENV = "STAGE";
import configStage from '../../../config';
describe('Config based on environment', () => {
    it('Config to exist', () => {
        expect(devConfig).to.exist;
        expect(satgeConfig).to.exist;
        expect(configDev).to.exist;
        expect(configStage).to.exist;
    });
    it('Dev config is loaded ', () => {
        expect(configDev.get("app").datasiteBasePath).to.be.equal(devConfig.app.datasiteBasePath);
    });
    it('Stage config is loaded ', () => {
        expect(configStage.get("app").datasiteBasePath).to.be.equal(satgeConfig.app.datasiteBasePath);
    });
});
