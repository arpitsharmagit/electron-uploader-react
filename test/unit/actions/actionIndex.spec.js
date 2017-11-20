import { renderComponent, expect } from '../test_helper';
import * as actions from "../../../src/app/actions";
import { LOGIN_USER, USER_PROFILE, LOGOUT_USER } from "../../../src/app/actions/types";

describe('Types ::', () => {
  it('Types should be defined', () => {
    expect(LOGIN_USER).to.exist;
    expect(USER_PROFILE).to.exist;
  });
  it('Types should be string', () => {
    expect(LOGIN_USER).to.be.a('string');
    expect(USER_PROFILE).to.be.a('string');
  });
});
describe('Actions', () => {
  it('Actions should be defined', () => {
    expect(actions).to.exist;
  });
  it('Action - calling loginUser', () => {
    const user = { name: "a" };
    let actionReturnProfile = actions.login.loginUser(user);
    expect(actionReturnProfile).to.have.a.property('type');
  });
  it('Action - calling loginUser checking type', () => {
    const user = { name: "a" };
    let actionReturnLogin = actions.login.loginUser(user);
    expect(actionReturnLogin.type).to.equal(LOGIN_USER);
  });
  it('Action - calling logoutUser checking type', () => {
    let actionReturnLogin = actions.userActions.logoutUser();
    expect(actionReturnLogin.type).to.equal(LOGOUT_USER);
  });
  it('Action - calling userProfile', () => {
    const user = { name: "a" };
    let actionReturnProfile = actions.userActions.userProfile(user);
    expect(actionReturnProfile).to.have.a.property('type');
  });
  it('Action - calling userProfile checking type', () => {
    const user = { name: "a" };
    let actionReturnProfile = actions.userActions.userProfile(user);
    expect(actionReturnProfile.type).to.equal(USER_PROFILE);
  });
});
