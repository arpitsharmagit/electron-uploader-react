import Config from '../../config';
var ua = require('universal-analytics');
const gaTackingID = Config.get('analytics').gaTrackingID;
const gaAnalytics = ua(gaTackingID);
export const screenView = (screenName)=>{
    gaAnalytics.event("SCREEN_VIEW", screenName).send();
};
export default gaAnalytics;
