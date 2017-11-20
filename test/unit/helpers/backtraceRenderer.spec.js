

import { expect } from '../test_helper';
import assert from 'assert';
import sinon from 'sinon';
var bt = require('backtrace-js');
import backTraceHelper from '../../../src/utility/backtraceRenderer';

describe('backTrace Helper', () => {
    let spy_backtrace = null;
    beforeEach(function () {
        spy_backtrace = sinon.stub(bt, 'initialize').returns(true);
    });
    afterEach(function () {
        spy_backtrace && spy_backtrace.restore();
    });
    it('backTrace Init', () => {
        backTraceHelper.init();
        assert(spy_backtrace.calledOnce, true);
    });
});
