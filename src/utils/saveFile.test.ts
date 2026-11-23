import { parseSavedGrid, serializeGrid, deriveResults, defaultFileName, LOAD_ERROR_MESSAGE } from './saveFile';

const snapshot = {
    listOfItems: ['', 'Alpha', 'Beta', 'Gamma', '', ''],
    choiceGrid: { 1: { 2: 2, 3: 1 }, 2: { 3: 0 } },
    largestEditedItemIndex: 3,
    prioritiesTitle: 'Weekend',
};

describe('serializeGrid / parseSavedGrid', () => {
    it('round-trips a grid of the same size, dropping undecided pairs', () => {
        const result = parseSavedGrid(serializeGrid(snapshot), 5);
        expect(result.ok).toBe(true);
        if (!result.ok) return;
        expect(result.snapshot.listOfItems).toEqual(snapshot.listOfItems);
        expect(result.snapshot.choiceGrid).toEqual({ 1: { 2: 2, 3: 1 } });
        expect(result.snapshot.largestEditedItemIndex).toBe(3);
        expect(result.snapshot.prioritiesTitle).toBe('Weekend');
        expect(result.droppedItemCount).toBe(0);
    });

    it('pads a smaller file to fit a larger grid', () => {
        const result = parseSavedGrid(serializeGrid(snapshot), 10);
        if (!result.ok) throw new Error('expected ok');
        expect(result.snapshot.listOfItems).toHaveLength(11);
        expect(result.snapshot.listOfItems.slice(1, 4)).toEqual(['Alpha', 'Beta', 'Gamma']);
    });

    it('fits a larger file into a smaller grid and reports what was left out', () => {
        const big = JSON.stringify({
            listOfItems: ['A', 'B', 'C', 'D'],
            choiceGrid: { 1: { 2: 1, 4: 4 }, 3: { 4: 3 } },
            largestEditedItemIndex: 4,
        });
        const result = parseSavedGrid(big, 2);
        if (!result.ok) throw new Error('expected ok');
        expect(result.snapshot.listOfItems).toEqual(['', 'A', 'B']);
        expect(result.snapshot.choiceGrid).toEqual({ 1: { 2: 1 } });
        expect(result.snapshot.largestEditedItemIndex).toBe(2);
        expect(result.fileItemCount).toBe(4);
        expect(result.droppedItemCount).toBe(2);
    });

    it('ignores trailing empty items when counting what was dropped', () => {
        const result = parseSavedGrid(JSON.stringify({ listOfItems: ['A', 'B', '', '', ''], choiceGrid: {} }), 3);
        if (!result.ok) throw new Error('expected ok');
        expect(result.droppedItemCount).toBe(0);
    });

    it('reads files saved before the version field existed', () => {
        const legacy = '{"choiceGrid":{"1":{"2":2}},"listOfItems":["A","B","","","","","","","",""],"largestEditedItemIndex":2,"prioritiesTitle":""}';
        const result = parseSavedGrid(legacy, 10);
        if (!result.ok) throw new Error('expected ok');
        expect(result.snapshot.choiceGrid).toEqual({ 1: { 2: 2 } });
    });

    it('ignores malformed choices', () => {
        const result = parseSavedGrid(JSON.stringify({ listOfItems: ['A', 'B', 'C'], choiceGrid: { 1: { 2: 3, 3: 'x' }, 3: { 2: 2 }, x: {} } }), 3);
        if (!result.ok) throw new Error('expected ok');
        expect(result.snapshot.choiceGrid).toEqual({});
    });

    it.each([
        ['not JSON', 'hello'],
        ['a JSON array', '[1, 2]'],
        ['an object without items', '{"choiceGrid": {}}'],
    ])('rejects %s', (_label, text) => {
        expect(parseSavedGrid(text, 10)).toEqual({ ok: false, error: LOAD_ERROR_MESSAGE });
    });
});

describe('deriveResults', () => {
    it('counts choices and ranks items', () => {
        const { countOfSelectedItems, listOfResultItems } = deriveResults(snapshot.listOfItems, snapshot.choiceGrid, 5);
        expect(countOfSelectedItems).toEqual([0, 1, 1, 0, 0, 0]);
        expect(listOfResultItems.slice(1, 4)).toEqual(['Alpha', 'Beta', 'Gamma']);
    });

    it('puts the most-chosen item first', () => {
        const { listOfResultItems } = deriveResults(['', 'A', 'B', 'C'], { 1: { 2: 2, 3: 3 }, 2: { 3: 3 } }, 3);
        expect(listOfResultItems).toEqual(['', 'C', 'B', 'A']);
    });
});

describe('defaultFileName', () => {
    it('uses the local date', () => {
        expect(defaultFileName(new Date(2026, 0, 5))).toBe('priorities-2026-01-05.json');
    });
});
