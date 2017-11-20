const assert = require('assert');
const expect = require('chai').expect;
const appSettings = require('../../config').get("appSetting");
describe('App Window Setting', function () {
  describe(' Dimensions :: ', function () {
    it('Window setting should contain height', function () {
      expect(appSettings).to.have.a.property('appHeight');
    });
    it('Window setting should contain width', function () {
      expect(appSettings).to.have.a.property('appWidth');
    });
    it('Window Dimensions should be numbers', function () {
      expect(appSettings.appHeight).to.be.a('number');
      expect(appSettings.appWidth).to.be.a('number');
    });
    it('Window Dimensions should be positive', function () {
        assert(appSettings.appWidth > 0);
        assert(appSettings.appHeight > 0);
    });
  });
  describe(' Toolbar setting :: ', function () {
    it('App setting should contain Toolbar setting', function () {
      expect(appSettings).to.have.a.property('appToolbar');
    });
    it('App setting should contain Toolbar visible', function () {
      assert(appSettings.appToolbar);
    });
  });
});
