import { expect, assert } from '../test_helper';
import {bytesToSize, IsJsonString} from '../../../src/app/helpers/sharedFunctions';
describe('SharedFunctions  utility', function () {
    describe(' operations', function () {
        it(' should convert bytes to size', function () {
            let sizeText = bytesToSize(1024);
            assert(sizeText, "1MB");
        });
        it(' should check for json string valid', function () {
            const jsonString = JSON.stringify({"id": 11});
            let isJsonString = IsJsonString(jsonString);
            assert(isJsonString, true);
        });
        it(' should check for json string in-valid', function () {
            const jsonString = "abc";
            let isJsonString = IsJsonString(jsonString);
            expect(isJsonString).to.be.false;
        });
    });
});
