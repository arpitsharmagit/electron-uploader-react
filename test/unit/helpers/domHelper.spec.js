import { renderComponent, expect, sinon, assert } from '../test_helper';
import domHelper from '../../../src/app/helpers/domHelper';
domHelper.preventDragDrop();
describe('DomHelper', function () {
    it('trigger dragover', function () {
        var event = new window.Event('dragover');
        expect(document.dispatchEvent(event)).to.be.true;
    });
    it('trigger drop', function () {
        var event = new window.Event('drop');
        expect(document.dispatchEvent(event)).to.be.true;
    });
});

