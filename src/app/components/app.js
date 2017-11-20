import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import Login from './Login/login';
import Home from './Home/home';
import { network } from "../actions";

const originalTitle = document.title;

ipcRenderer && ipcRenderer.on('message', function (event, text) {
    document.title = text;
});

class App extends Component {
  componentDidMount() {
    window.addEventListener('online', this.updateOnLineStatus.bind(this));
    window.addEventListener('offline', this.updateOnLineStatus.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener('online', this.updateOnLineStatus);
    window.removeEventListener('offline', this.updateOnLineStatus);
  }
  updateOnLineStatus() {
    this.props.changeNetworkStatus(window.navigator.onLine);
  }
  render() {
    if (!this.props.isLoggedIn) {
      return (
        <Login />
      );
    } return (
      <Home />
    );
  }
}
const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.isLoggedIn
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    changeNetworkStatus: (data) => dispatch(network.changeNetworkStatus(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
