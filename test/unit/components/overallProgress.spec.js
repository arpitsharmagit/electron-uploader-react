import { renderComponent, expect } from '../test_helper';
import OverallProgress from '../../../src/app/components/Common/overallProgress';
const state = {
    "user": {
        "project": {
            "projectId": "591b10726e65f10010a42267"
        }
    },
    "upload": {
        stats: {
            "591b10726e65f10010a42267": {
                countProgress: 1,
                countPending: 0,
                countFailed: 0,
                countCompleted: 0,
                countCancelled: 0,
                countTotal: 0,
                overallProgress: 0
            }
        }
    }
};
describe('OverallProgress component', () => {
    let component;
    beforeEach(() => {
        component = renderComponent(OverallProgress, null, state);
    });
    it('renders OverallProgress component', () => {
        expect(component).to.exist;
    });
    it('should have child compnent', () => {
        expect(component.find('div')).to.exist;
    });
});
