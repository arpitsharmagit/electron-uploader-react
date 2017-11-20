import { expect } from '../test_helper';
import * as utils from '../../../src/app/helpers/sharedFunctions';

describe('Shared Functions- Test', () => {
    it('should convert bytes to readable notation', () => {
        expect(utils.bytesToSize(0)).to.equals('0 Byte');
        expect(utils.bytesToSize('1024')).to.equals('1 KB');
    });
    it('should retrun false if argument is not valid json string', () => {
        const json = { name: 'abc' };
        expect(utils.IsJsonString(json)).to.be.false;
    });
    it('should retrun true if argument is json', () => {
        const jsonString = "{\"name\":\"abc\"}";
        expect(utils.IsJsonString(jsonString)).to.be.true;
    });
});

