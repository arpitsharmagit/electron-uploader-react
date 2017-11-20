import React from 'react';
import config from '../../../../config';
const messages = config.get('messages');
const OfflineScreen = (props) => {
    const {offline, networkError} = messages;
    return (<div className="loader-container"><p className="offline-msg"><b>{networkError}</b> {offline}</p></div>);
};
export default OfflineScreen;
