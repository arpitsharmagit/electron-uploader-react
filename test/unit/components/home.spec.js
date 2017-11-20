import { renderComponent, expect, sinon, fetchMock } from '../test_helper';
import status from '../../../src/app/helpers/constants';
import config from '../../../config';
import Home from '../../../src/app/components/Home/home';
const API = config.get('API');

const props = {
  createMetadata: sinon.spy(),
  selectProject: sinon.spy(),
  userProfile: sinon.spy(),
  filter: sinon.spy(),
  logoutUser: sinon.spy(),
  clearList: sinon.spy(),
  apiProgress: sinon.spy(),
  userDetailError: sinon.spy()
};


describe('Home component', () => {
  beforeEach(() => {
    fetchMock.get(API.baseUrl + API.currentUser, (url, opts) => {
      return {
        status: 200,
        body: JSON.stringify({ "projects": [{ "projectId": "591b10726e65f10010a42267", "name": "dmd acc tests dev", "description": "Project for DMD acceptance tests in dev", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "591b4a203c0fcb001080d58b", "name": "BEST OF LONDON", "description": "required", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "593790ddc494b10010ddfe13", "name": "Qwerty1", "description": "dfbgdfbgf", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "5937ac6fa9b7aa0018598029", "name": "qrty", "description": "qaby", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "59391f0c114e0c001541cfab", "name": "K_Node", "description": "K_Node", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "593a390e74e85a0014b71a7a", "name": "MongoDB", "description": "Document based", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "593a43b695da170010ee5a18", "name": "Test1", "description": "Test1", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "593a6e1274e85a0014b71bae", "name": "Demo_Project", "description": "Demo project", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "58d96829f8381600144508e3", "name": "Best of Paris", "description": "Best of Paris", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "594251371683c500104150f1", "name": "gary", "description": "test", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "594266b6b35e7e0011a219cc", "name": "gretchen", "description": "", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "5943f9ff09b7a70010e2c204", "name": "josh", "description": "yeheh", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "594acd3c178f8b0011765b38", "name": "Merrillicious", "description": "Fancy fun.", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "595b7734bf2e2a0010a427f0", "name": "GA_Tracker", "description": "Creating project to send event to GA", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "5930596dcf18fe001505f753", "name": "Q&A Testing Project", "description": "string", "status": "ACTIVE", "userType": "REVIEWER", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "595f5697cae16e00110208d2", "name": "Gary Demo", "description": "", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "595f56facae16e00110208ed", "name": "bump up the screen", "description": "", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "59674d042d3c9f0011330fcd", "name": "AccSpec_MessageTemplate_Prj_DND", "description": "testdescription", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "59679ace29cc3b00156893dc", "name": "Test11", "description": "New Project", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "5968717682ca160011137858", "name": "DocProcessingAcceptanceTests", "description": "DocProcessing service Acceptance Tests project", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "5968761495ad16001066ea52", "name": "DocProcessingAccTestDev", "description": "DocProcessing service Acceptance Tests project", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "596bdb3e95ad160010670129", "name": "Test Project", "description": "hello", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "596d0df795ad1600106708dc", "name": "test new project", "description": "test qnew prpject", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "596d13de82ca160011139754", "name": "name123", "description": "test", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "596d13ea82ca160011139755", "name": "name123355", "description": "test", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "596d13fd95ad1600106708dd", "name": "Ji project111", "description": "test", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "59796ff65c620f00105c0349", "name": "test-project", "description": "adding description to test the test-project", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "599ad4adcd08ac0010317d66", "name": "hari demo", "description": "geheh", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "599fdd3e646290000feacaf5", "name": "Gary Test", "description": "", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }, { "projectId": "599fe089646290000feacb15", "name": "bump project up", "description": "", "status": "ACTIVE", "userType": "ADMIN", "projectDisclaimerAccepted": false, "disclaimerText": "", "disclaimerTitle": "Condition of Access", "domainUrl": "https://dev-web.core.merrillcorp.com" }] })
      };
    });
  });
  afterEach(()=>{
    fetchMock.restore();
  });
  it('renders home component No Error', () => {
    const state = {
      user: { isLoggedIn: false, jwt: 'mytoken', profile: {}, projects: [{ name: 'myproject', id: '1' }], project: {} },
      location: { folderId: null },
      network: {
        online: true,
        APICallInProgress: false,
        hasUserDetailError: false
      }
    };
    const component = renderComponent(Home, props, state);
    expect(component.find('.topbar')).to.exist;
  });
  it('renders home component show Progress', () => {
    const state = {
      user: { showProgress: true, isLoggedIn: false, jwt: 'mytoken', profile: {}, projects: [{ name: 'myproject', id: '1' }], project: {} },
      location: { folderId: null },
      network: {
        online: true,
        APICallInProgress: false,
        hasUserDetailError: false
      }
    };
    const component = renderComponent(Home, props, state);
    expect(component.find('.topbar')).to.exist;
  });
  it('renders home component user error', () => {
    const state = {
      user: { showProgress: true, isLoggedIn: false, jwt: 'mytoken', profile: {}, projects: [{ name: 'myproject', id: '1' }], project: {} },
      location: { folderId: null },
      network: {
        online: true,
        APICallInProgress: false,
        hasUserDetailError: true
      }
    };
    const component = renderComponent(Home, props, state);
    expect(component.find('.topbar')).to.exist;
  });
  it('renders home component Api call in progress', () => {
    const state = {
      user: { showProgress: true, isLoggedIn: false, jwt: 'mytoken', profile: {}, projects: [{ name: 'myproject', id: '1' }], project: {} },
      location: { folderId: null },
      network: {
        online: true,
        APICallInProgress: true,
        hasUserDetailError: false
      }
    };
    const component = renderComponent(Home, props, state);
    expect(component.find('.topbar')).to.exist;
  });
  it('renders home component Offline', () => {
    const state = {
      user: { isLoggedIn: true, jwt: 'mytoken', profile: { firstName: "abc" }, projects: [{ name: 'myproject', id: '1' }], project: { name: 'myproject', id: '1' } },
      location: { folderId: null, fileRoomError: null },
      network: {
        online: false,
        APICallInProgress: false,
        hasUserDetailError: false
      }
    };
    const component = renderComponent(Home, props, state);
    expect(component.find('.topbar')).to.exist;
  });
});
