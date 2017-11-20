var Application = require('spectron').Application;
var assert = require('assert');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
module.exports = {
    Application,
    assert,
    path,
    chai,
    chaiAsPromised,
    expect
};

