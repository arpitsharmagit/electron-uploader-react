import { renderComponent, expect, fetchMock, sinon } from '../test_helper';
import Login from '../../../src/app/components/Login/login';
import Config from '../../../config';

const API = Config.get('API');

const state = { user: { isLoggedIn: false, jwt: null, profile: {}, projects: [], project: {} } };

const props = {
  loginUser: () => sinon.spy()
};

describe('login component', () => {
  let component, expectedText = 'test@gmail.com';
  beforeEach(() => {
    component = renderComponent(Login, props, state);
  });
  it('renders login component', () => {
    expect(component).to.exist;
  });
  it('should have username input', () => {
    expect(component.find('input[name="username"]').length).to.equal(1);
  });
  it('should have password input', () => {
    expect(component.find('input[name="password"]').length).to.equal(1);
  });
  it('username should match ', () => {
    component.find('input[name="username"]').simulate('change', expectedText);
    expect(component.find('input[name="username"]')).to.have.value(expectedText);
  });
  it('password should match ', () => {
    const passwordText = "abc";
    component.find('input[name="password"]').simulate('change', passwordText);
    expect(component.find('input[name="password"]')).to.have.value(passwordText);
  });
  it('login should perform ', () => {
    fetchMock.post(API.tokenUrl, () => {
      return {
        status: 201,
        body: JSON.stringify({
          access_token: "eyJhbG",
          expires_in: 36119,
          token_type: "Bearer"
        })
      };
    });
    component.find('input[name="username"]').simulate('change', "testuser");
    component.find('input[name="password"]').simulate('change', "testpassword");
    component.find('.form-signin').simulate('submit');
    expect(component.find('div')).to.exist;
    fetchMock.restore();
  });
  it('login should perform ', () => {
    fetchMock.post(API.tokenUrl, () => {
      return {
        status: 201,
        body: JSON.stringify({
          error_description: "unable to login"
        })
      };
    });
    component.find('input[name="username"]').simulate('change', "testuser");
    expect(component.find('input[name="username"]')).to.have.value("testuser");
    component.find('input[name="password"]').simulate('change', "testpassword");
    expect(component.find('input[name="password"]')).to.have.value("testpassword");
    component.find('.form-signin').simulate('submit');
    expect(component.find('div')).to.exist;
    fetchMock.restore();
  });
});
