var Application = require('spectron').Application;
var assert = require('assert');
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
var electronPath = `${__dirname}/../../node_modules/.bin/electron`;
// handle win32 os
if (process.platform === 'win32') {
    electronPath += '.cmd';
}
// init app for testing
var app = new Application({
    path: electronPath,
    args: ["index.js"]
});
global.before(function () {
    chai.should();
    chai.use(chaiAsPromised);
});
describe("desktop Uploader Application", function () {
    this.timeout(60000);
    beforeEach(function () {
        return app.start();
    });
    afterEach(function () {
        // Close app after each test case
           return app.stop();
      });
    it('desktop Uploader starts and visible', function () {
        this.timeout(60000);
        return app.client.waitUntilWindowLoaded()
            .getTitle().should.eventually.equal('desktop Uploader');
    });
});
