import { render } from '@testing-library/react';
import PrioritizationGrid from './PrioritizationGrid';
import { choiceGridGeometry } from './ChoiceGrid';

const itemFieldCount = () => document.querySelectorAll('.ItemList textarea').length;
const resultFieldCount = () => document.querySelectorAll('.ResultList textarea').length;
const choiceBoxCount = () => document.querySelectorAll('.ChoiceBox').length;
const countCellCount = () => document.querySelectorAll('.ResultGridCell').length;

describe('PrioritizationGrid item count', () => {
    it.each([
        [1, 3], [2, 3], [3, 3], [10, 10], [25, 25], [26, 25], [40, 25], [Number.NaN, 10],
    ])('requested %p renders %p slots everywhere', (requested, expected) => {
        render(<PrioritizationGrid maxItems={requested} />);
        expect(itemFieldCount()).toBe(expected);
        expect(resultFieldCount()).toBe(expected);
        expect(countCellCount()).toBe(expected);
        // One box per pair of items.
        expect(choiceBoxCount()).toBe((expected * (expected - 1)) / 2);
    });
});

describe('choiceGridGeometry', () => {
    it('sizes the canvas to the rotated grid', () => {
        // 10 items: 9 boxes along an edge at a 44px pitch, plus the 2px overlap.
        const { side, width, height } = choiceGridGeometry(10);
        expect(side).toBe(398);
        // Width includes the staircase corners poking out on the left (46px box / √2).
        expect(width).toBeCloseTo(398 / Math.SQRT2 + 46 / Math.SQRT2);
        expect(height).toBeCloseTo(2 * 398 / Math.SQRT2);
    });
});
