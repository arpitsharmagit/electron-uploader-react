import { renderComponent, expect, sinon, assert } from '../test_helper';
var proxyquire = require('proxyquire');
const screenName = 'HOME';
const mixPanelMock = {
    screenView: (_screenName) => {
        mixPanelMock.screenViewName = _screenName;
    }
};
const gaTrackerMock = {
    screenView: (_screenName) => {
        gaTrackerMock.screenViewName = _screenName;
    }
};
const ReactDOMMock = {
    render: () => {
        ReactDOMMock.appRendered = true;
    }
};

const trayUtil = proxyquire('../../../src/app/index.js', {
    '../utility/mixPanelTracker': mixPanelMock,
    '../utility/gaTracker': gaTrackerMock,
    'react-dom': ReactDOMMock,
    '@global': true
});

const thunk = ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
        return action(dispatch, getState);
    }

    return next(action);
};

const create = () => {
    const store = {
        getState: (() => ({})),
        dispatch: () => { }
    };
    const next = sinon.spy();

    const invoke = (action) => thunk(store)(next)(action);

    return { store, next, invoke };
};

describe('Rendering App component', () => {
    it('App to be rendered', () => {
        expect(ReactDOMMock.appRendered).to.be.true;
    });
    it('Mix Panel tracking:: ', () => {
        expect(mixPanelMock.screenViewName).to.be.equal(screenName);
    });
    it('GA tracing ::', () => {
        expect(gaTrackerMock.screenViewName).to.be.equal(screenName);
    });
    it('middleware call ::', () => {
        const { next, invoke } = create();
        const action = { type: 'LOGIN_USER' };
        invoke(action);
        assert(next.calledWith(action));
    });
});
