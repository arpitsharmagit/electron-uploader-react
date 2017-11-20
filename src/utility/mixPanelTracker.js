import Config from '../../config';
var Mixpanel = require('mixpanel');
const mixPanelTrackingId = Config.get('analytics').mixPanelTrackingId;
const mixpanel = Mixpanel.init(mixPanelTrackingId);
export const screenView = (screenName)=>{
    mixpanel.track('SCREEN_VIEW', { "screenName": screenName });
};
export default mixpanel;
