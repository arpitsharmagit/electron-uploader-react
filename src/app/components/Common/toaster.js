import React, { Component } from 'react';
import { connect } from 'react-redux';
import { notification } from '../../actions';
import { ToastContainer, ToastMessage } from 'react-toastr';
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

import config from '../../../../config';
const appConfig = config.get('app');
const timeOut = appConfig.notificationTimeOut;

export class Toast extends Component {
    componentWillReceiveProps(nextProps) {
        if (this.props.notifications.length !== nextProps.notifications.length) {
            const data = nextProps.notifications.shift();
            const key = Object.keys(data).pop();
            const { contentId, title, message, type } = data[key];
            switch (type) {
                case "success":
                    this.container.success(message, title, { closeButton: true, timeOut, tapToDismiss: true });
                    break;
                case "error":
                    this.container.error(message, title, { closeButton: true, timeOut, tapToDismiss: true });
                    break;
                default:
                    break;
            }
            this.props.removeToast(contentId);
        }
    }
    render() {
        return (<ToastContainer ref={(input) => { this.container = input; }}
            toastMessageFactory={ToastMessageFactory}
            className="toast-bottom-right"
            preventDuplicates={false} />);
    }
}
const mapStateToProps = state => {
    return {
        notifications: state.notification
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        removeToast: (contentId) => dispatch(notification.removeToast(contentId))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Toast);
