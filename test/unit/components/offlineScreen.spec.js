import { renderComponent, expect } from '../test_helper';
import OfflineScreen from '../../../src/app/components/Common/offlineScreen';

describe('offlineScreen component', () => {
    let component;
    beforeEach(() => {
        component = renderComponent(OfflineScreen);
    });
    it('renders offlineScreen component', () => {
        expect(component).to.exist;
    });
});
describe('should display overlay', () => {
    let container;
    beforeEach(() => {
        container = renderComponent(OfflineScreen);
    });
    it('container should have offline overlay div', () => {
        expect(container.find('.offline-msg').length).to.equal(1);
    });
    it('container should show network error msg in bold ', () => {
        expect(container.find('b').length).to.equal(1);
    });
});
