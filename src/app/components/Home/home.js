import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileList from './fileList';
import { upload, fileroom, userActions, network } from "../../actions";
import { ipcRenderer } from 'electron';
import helper from '../../helpers';
import status from '../../helpers/constants';
import Loader from '../Common/loader';
import LoaderAPI from '../Common/loader.api';
import OfflineScreen from '../Common/offlineScreen';
import DropContainer from '../Common/drop';
import Toast from '../Common/toaster';
import Tree from './treeWrapper';
import DropSelector from '../Common/dropSelector';
import { Button, Badge, Tabs, Tab, Dropdown, DropdownButton, MenuItem, Alert, ButtonToolbar } from 'react-bootstrap';
// import AddProject from '../Common/addProject';
const CONST_SERVER_ERR = "Server - Something went wrong";
import config from '../../../../config';
const { webURL } = config.get('appSetting');

const menuList = [{ name: "Sign Out" }];
class Home extends Component {
  constructor(props) {
    super(props);
    this.handleSelect.bind(this);
    this.state = { key: 1, adminAccessError: false };
  }
  componentDidMount() {
    if (this.props.user.jwt) {
      helper.apiHelper.token = this.props.user.jwt;
      // get user info and users projects
      this.getCurrentUserInfo();
    }
  }
  getCurrentUserInfo() {
    this.props.apiProgress(true);
    helper.apiHelper.getUserInfo().then((response) => response.json())
      .then((user) => {
        this.props.apiProgress(false);
        this.props.userDetailError(false);
        if (user) {
          let profile = {
            "emailAddress": user.email,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "userId": user.userId
          };
          this.menuList = [...menuList];
          menuList[0].onClick = this.props.logoutUser;
          menuList.unshift({ name: user.firstName + " " + user.lastName, onClick: () => { } });
          const projectsWithAdminAccess = user.projects.filter(prj => prj.userType === "ADMIN" && prj.status === "ACTIVE");
          if (!projectsWithAdminAccess.length) {
            this.setState({ adminAccessError: true });
          }
          this.props.userProfile({ profile: profile, projects: projectsWithAdminAccess });
        } else {
          // TODO handle server errors
          this.props.userDetailError(true);
        }
      })
      .catch((e) => {
        // TODO expection handling
        this.props.apiProgress(false);
        this.props.userDetailError(true);
        // alert(CONST_SERVER_ERR);
      });
  }
  renderproject(project, index) {
    return (<MenuItem key={index} onSelect={() => {
      this.projectSelected(project, index);
    }}> {project.name}</MenuItem>);
  }
  projectSelected(project, index) {
    this.props.selectProject(project);
    this.handleSelect(1); // default to QuickDrop
  }
  logoutUser() {
    window.localStorage && window.localStorage.setItem('keepmelogin', false);
    this.props.logoutUser && this.props.logoutUser();
  }
  handleClearList(e) {
    this.props.clearList(e);
  }
  handleSelect(key) {
    this.setState({ key });
  }
  handleDataSitelink() {
    ipcRenderer && ipcRenderer.send('loadGH', webURL);
  }
  render() {
    const selectedKey = this.state.key;
    let dropTitle = <strong style={{ color: '#0288D1' }}>Add Files</strong>;
    let progressTitle = <strong style={{ color: '#0288D1' }}>View Progress</strong>;
    if (selectedKey === 1) {
      dropTitle = <strong style={{ color: '#212121' }}>Add Files</strong>;
    }
    if (selectedKey === 2) {
      progressTitle = <strong style={{ color: '#212121' }}>View Progress</strong>;
    }
    return (
      <div className="layoutInner innerlayout">
        {(this.props.user.showProgress) && (<div className="loader-container">
          <LoaderAPI />
        </div>)
        }
        {(!this.props.online) && (<OfflineScreen />)}
        {(this.props.APICallInProgress) && (<div className="loader-container"><LoaderAPI /></div>)}
        <div className="topbar">
          <div className="projectlist">
            <Dropdown id="dropdown-project">
              <Button bsStyle="default">
                {this.props.user.project.name || "Select Project"}
              </Button>
              <Dropdown.Toggle bsStyle="default" />
              <Dropdown.Menu className="user-projects">
                {this.props.user.projects.map(this.renderproject.bind(this))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <DropSelector />
          <div className="seting-menu">
            <ButtonToolbar>
              <DropdownButton bsStyle="default" title="Menu" id="dropdown-no-caret">
                <MenuItem key={0}>
                  {this.props.user.profile.firstName ? this.props.user.profile.firstName + " " + this.props.user.profile.lastName : " "}
                </MenuItem>
                <MenuItem onClick={this.logoutUser.bind(this)} key={1}>Sign Out</MenuItem>
              </DropdownButton>
            </ButtonToolbar>
          </div>
          {!this.props.location.fileRoomError && this.props.user.projects.length > 0 && !this.props.location.folderId && (<Alert bsStyle="info">
            <p>Choose a Project where you want to upload files</p>
          </Alert>)}
        </div>
        {this.props.hasUserDetailError && (<div className="user-detail-error">
          <Alert bsStyle="danger">
            <p>Unable to get user details</p>
            <p>
              <Button onClick={() => {
                this.getCurrentUserInfo();
              }} bsStyle="danger">Retry Now</Button>
            </p>
          </Alert>
        </div>)}
        {this.state.adminAccessError && (<div className="user-detail-error">
          <Alert bsStyle="danger">
            <p>You are not an administrator of any project.<br />
              Please log into <a href="#" onClick={() => {
                this.handleDataSitelink();
              }}> DatasiteOne</a>.
            </p>
          </Alert>
        </div>)}
        {!this.props.hasUserDetailError && this.props.location.fileRoomError && (<div className="user-detail-error">
          <Alert bsStyle="danger">
            <p>Unable to get default fileroom for {this.props.user.project.name}</p>
            <p>
              <Button onClick={() => {
                this.props.selectProject(this.props.user.project);
              }} bsStyle="danger">Retry</Button>
            </p>
          </Alert>
        </div>)}
        {!this.props.location.fileRoomError && this.props.location.folderId && (<div className="clearlist-container">
          <DropdownButton title="Clear List" id="clearList" className="" onSelect={(e) => this.handleClearList(e)}>
            <MenuItem eventKey={null}>Clear <strong>All Uploads</strong> List</MenuItem>
            <MenuItem eventKey={status.COMPLETE}>Clear <strong>Successful Uploads</strong> List</MenuItem>
            <MenuItem eventKey={status.ERROR}>Clear <strong>Failed Uploads</strong> List</MenuItem>
            <MenuItem eventKey={status.CANCEL}>Clear <strong>Cancel Uploads</strong> List</MenuItem>
          </DropdownButton>
        </div>)}
        {this.props.location.folderId && (
          <Tabs activeKey={this.state.key} onSelect={(e) => this.handleSelect(e)} id="main-tab">
            <Tab eventKey={1} title={dropTitle}>
              {this.props.user.project.projectId &&
                this.props.location.isMyFolders &&
                <Tree projectId={this.props.user.project.projectId} />
              }
              {this.props.user.project.projectId && !this.props.location.isMyFolders &&
                <DropContainer />
              }
            </Tab>
            <Tab eventKey={2} title={progressTitle}>
              <FileList />
            </Tab>
          </Tabs>
        )}
        <Toast />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    location: state.location,
    online: state.network.online,
    APICallInProgress: state.network.callingAPI,
    hasUserDetailError: state.network.userDetailError
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    createMetadata: (projectId, metadata) => dispatch(upload.createMetadata(projectId, metadata)),
    selectProject: (project) => dispatch(fileroom.selectProject(project)),
    userProfile: (profile) => dispatch(userActions.userProfile(profile)),
    filter: (filterStatus) => dispatch(upload.filter(filterStatus)),
    logoutUser: (data) => dispatch(userActions.logoutUser()),
    clearList: (statusToRemove) => dispatch(upload.clearList(statusToRemove)),
    apiProgress: (callInProgress) => dispatch(network.changeAPICallingStatus(callInProgress)),
    userDetailError: (isOn) => dispatch(network.userDetailError(isOn))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
