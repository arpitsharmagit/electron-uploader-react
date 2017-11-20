import { renderComponent, expect } from '../test_helper';
import assert from 'assert';
import sinon from 'sinon';
import gaAnalytics, { screenView as gaScreenView } from '../../../src/utility/gaTracker';
import mixpanel, { screenView as mixScreenView } from '../../../src/utility/mixPanelTracker';

describe('Analytics Helper', () => {
    let spy_mixpanel = null;
    let spy_gaAnalytics = null;

    beforeEach(function () {
        spy_mixpanel = sinon.stub(mixpanel, 'track').returns(true);
        spy_gaAnalytics = sinon.stub(gaAnalytics, 'event').returns({ send: sinon.stub() });
    });
    afterEach(function () {
        spy_mixpanel && spy_mixpanel.restore();
        spy_gaAnalytics && spy_gaAnalytics.restore();
    });
    it('MixPanel Analytics', () => {
        it('Home screen view', () => {
            mixScreenView('home');
            mixpanel.track("Home Screen View");
            assert(spy_mixpanel.calledOnce, true);
        });
    });
    it('Google Analytics', () => {
        it('Home screen view', () => {
            gaScreenView('home');
            gaAnalytics.event("SCREEN_VIEW", 'Home').send();
            assert(spy_gaAnalytics.calledOnce, true);
        });
    });
});
