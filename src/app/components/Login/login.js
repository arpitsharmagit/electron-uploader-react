import React, { Component } from 'react';
import { connect } from 'react-redux';
import helper from '../../helpers';
import LoaderAPI from '../Common/loader.api';
import { login } from "../../actions";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { userName: '', password: '', error_description: "" };
    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChangeUser(event) {
    this.setState({ userName: event.target.value, loginError: false });
  }
  handleChangePassword(event) {
    this.setState({ password: event.target.value, loginError: false });
  }
  handleSubmit(event) {
    event.preventDefault();
    // trigger login on form submit
    this.setState({ showProgress: true });
    this.loginUser();
  }
  // keep me login
  handlekeepMelogin(event) {
    window.localStorage.removeItem("keepmelogin");
    window.localStorage.setItem('keepmelogin', event.target.checked);
  }
  loginUser() {
    helper.apiHelper.login({ userName: this.state.userName, password: this.state.password }).then((response) => {
      return response.json();
    })
      .then((user) => {
        if (user && user.access_token) {
          this.props.loginUser(user.access_token, user.refresh_token);
        } else {
          // TODO handle server response
          user = user || {};
          throw { error_description: user.error_description };
        }
      }).catch((e) => {
        let errorMessage = e.error_description || "Unable to Login";
        if (e instanceof Error) {
          if (e.message === 'Failed to fetch' || e.code === 'ECONNRESET') {
            errorMessage = `No Internet Connection.`;
          }
          if (e.code === "ETIMEDOUT") {
            errorMessage = `Server didn't respond. Please try again login. `;
          }
        }
        this.setState({
          showProgress: false, loginError: true, error_description: errorMessage
        });
      });
  }
  render() {
    // Login form
    return (<div></div>);
  }
}
const mapStateToProps = state => {
  return {
    user: state.user
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (data, refresh_token) => dispatch(login.loginUser(data, refresh_token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
