import { replaceAt } from './utils';

describe('replaceAt', () => {
    it('replaces at the beginning', () => {
        expect(replaceAt([2, 3], 0, 1)).toEqual([1, 3]);
    });
    
    it('replaces in the end', () => {
        expect(replaceAt([1, 3], 1, 2)).toEqual([1, 2]);
    });
    
    it('replaces in the middle', () => {
        expect(replaceAt([1, 2, 3], 1, 0)).toEqual([1, 0, 3]);
    });
});
