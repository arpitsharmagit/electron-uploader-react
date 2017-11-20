import Config from '../../config';
var bt = require('backtrace-js');
const backtraceRenderedConfig = Config.get('backtraceRenderedConfig');
class BackTrace {
    init() {
        bt.initialize(backtraceRenderedConfig);
    }
}

export default new BackTrace();
