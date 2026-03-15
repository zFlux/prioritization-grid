import { replaceAt, convertToItemNumbersInRankedOrder, getMaxItemsFromSearchParams } from './utils';

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

describe('convertToItemNumbersInRankedOrder', () => {
    it('leaves item number is original order when list of item counts are all zero', () => {
        expect(convertToItemNumbersInRankedOrder([0,0,0,0,0,0,0,0,0,0])).toEqual([0,1,2,3,4,5,6,7,8,9]);
    });

    it('elevates item number to first place when it has the highest count', () => {
        expect(convertToItemNumbersInRankedOrder([0,0,0,0,0,0,0,0,0,1])).toEqual([0,9,1,2,3,4,5,6,7,8]);
    });

    it('leaves item numbers in original order when counts are all equal', () => {
        expect(convertToItemNumbersInRankedOrder([1,1,1,1,1,1,1,1,1,1])).toEqual([0,1,2,3,4,5,6,7,8,9]);
    });

    it('orders item numbers by count', () => {
        expect(convertToItemNumbersInRankedOrder([0,0,0,0,0,0,0,0,2,1])).toEqual([0,8,9,1,2,3,4,5,6,7]);
    });
});

describe('getMaxItemsFromSearchParams', () => {
    it('returns default 10 when no param', () => {
        expect(getMaxItemsFromSearchParams('')).toBe(10);
        expect(getMaxItemsFromSearchParams('?')).toBe(10);
    });
    it('parses items param', () => {
        expect(getMaxItemsFromSearchParams('?items=16')).toBe(16);
        expect(getMaxItemsFromSearchParams('?items=5')).toBe(5);
    });
    it('clamps to min 2 and max 25', () => {
        expect(getMaxItemsFromSearchParams('?items=1')).toBe(2);
        expect(getMaxItemsFromSearchParams('?items=30')).toBe(25);
    });
    it('returns default for invalid value', () => {
        expect(getMaxItemsFromSearchParams('?items=abc')).toBe(10);
        expect(getMaxItemsFromSearchParams('?items=')).toBe(10);
    });
});
