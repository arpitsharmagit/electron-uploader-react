import { expect } from '../test_helper';
import * as actions from "../../../src/app/actions";
import { NETWORK_STATUS, SHOW_API_LOADER, USER_DETAILS_ERROR} from "../../../src/app/actions/types";

describe('Types ::', () => {
  it('Types should be defined', () => {
    expect(NETWORK_STATUS).to.exist;
  });
  it('Types should be string', () => {
    expect(NETWORK_STATUS).to.exist;
    expect(NETWORK_STATUS).to.be.a('string');
    expect(SHOW_API_LOADER).to.exist;
    expect(SHOW_API_LOADER).to.be.a('string');
  });
});
describe('Actions', () => {
  it('Actions should be defined', () => {
    expect(actions).to.exist;
  });
  it('Action - calling changeNetworkStatus', () => {
    let actionReturnNetwork = actions.network.changeNetworkStatus(true);
    expect(actionReturnNetwork).to.have.a.property('type');
  });
  it('Action - calling changeNetworkStatus checking type', () => {
    let actionReturnNetwork = actions.network.changeNetworkStatus(true);
    expect(actionReturnNetwork.type).to.equal(NETWORK_STATUS);
  });
  it('Action - calling changeAPICallingStatus checking type', () => {
    let actionReturnNetwork = actions.network.changeAPICallingStatus(true);
    expect(actionReturnNetwork.type).to.equal(SHOW_API_LOADER);
  });
  it('Action - calling userDetailError checking type', () => {
    let actionReturnuserDetailError = actions.network.userDetailError(true);
    expect(actionReturnuserDetailError.type).to.equal(USER_DETAILS_ERROR);
  });
  it('Action - calling userDetailError checking payload(error on)', () => {
    let actionReturnuserDetailError = actions.network.userDetailError(true);
    expect(actionReturnuserDetailError.payload).to.be.true;
  });
  it('Action - calling userDetailError checking payload(error off)', () => {
    let actionReturnuserDetailError = actions.network.userDetailError(false);
    expect(actionReturnuserDetailError.payload).to.be.false;
  });
});
