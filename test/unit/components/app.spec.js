import { renderComponent, expect } from '../test_helper';
import App from '../../../src/app/components/app';

describe('App component', () => {
  let component;
  beforeEach(() => {
    component = renderComponent(App);
  });
  it('renders app component', () => {
    expect(component).to.exist;
  });
});
