import { renderComponent, expect } from '../test_helper';
import Loader from '../../../src/app/components/Common/loader';

describe('Loader component', () => {
    let component;
    beforeEach(() => {
        component = renderComponent(Loader);
    });
    it('renders Loader component', () => {
        expect(component).to.exist;
    });
});
