import React from 'react';
import ChoiceBox from './ChoiceBox';
import './ChoiceGrid.scss';
import { type HashTable } from '../utils/utils';

interface ChoiceGridProps {
    choiceGridData: HashTable<HashTable<number>>;
    gridSize: number;
    onChange: (firstChoice: number, secondChoice: number, chosen: number) => void;
    largestEditedItemIndex: number;
}

/** Distance between neighbouring boxes: a 46px box (42 + 2×2 border) overlapping its neighbour by 2px. */
export const CHOICE_PITCH = 44;
const CHOICE_OVERLAP = 2;
/** Below this many items the diagonal edge is too short for the title, so it goes above the grid instead. */
export const DIAGONAL_TITLE_MIN_ITEMS = 8;

/**
 * Geometry of the rotated grid. The boxes form a staircase triangle inside a
 * square of side `side`; rotating that square by -45deg about its centre turns
 * the triangle into the shape on screen: a right-hand apex `halfDiagonal` from
 * the centre line, and a left edge of height 2 × `halfDiagonal`. That left edge
 * is the staircase, so the boxes' outer corners stick out past the centre line
 * by `stepOverhang` (one box's half-diagonal); the canvas reserves room for it.
 */
export function choiceGridGeometry(gridSize: number) {
    const side = Math.max(0, gridSize - 1) * CHOICE_PITCH + CHOICE_OVERLAP;
    const halfDiagonal = side / Math.SQRT2;
    const stepOverhang = gridSize > 1 ? (CHOICE_PITCH + CHOICE_OVERLAP) / Math.SQRT2 : 0;
    return { side, halfDiagonal, stepOverhang, width: halfDiagonal + stepOverhang, height: 2 * halfDiagonal };
}

export default class ChoiceGrid extends React.Component<ChoiceGridProps> {

    constructor(props: ChoiceGridProps) {
        super(props);
        this.getChosenValue = this.getChosenValue.bind(this);
    }

    getChosenValue(choiceOne: number, choiceTwo: number): number {
        const choiceGrid = this.props.choiceGridData;
        if (choiceGrid[choiceOne] && choiceGrid[choiceOne][choiceTwo] !== undefined) {
          return choiceGrid[choiceOne][choiceTwo];
        }
        return 0;
      }

    buildGrid() {
        let grid = [];
        for (let i = this.props.gridSize; i >= 1 ; i--) {
            let row = [];
            for (let j = 1 ; j <= this.props.gridSize - i; j++) {
                const isItemBoxSelectable = i <= this.props.largestEditedItemIndex && (j+i) <= this.props.largestEditedItemIndex;
                row.push(<ChoiceBox key={j + " " + i} firstOption={i} secondOption={j+i} selectable={isItemBoxSelectable} selected={this.getChosenValue(i,j+i)} onChange={this.props.onChange} />);
            }
            grid.push(<div className='ChoiceGridColumn' key={i}>{row}</div>);
        }
        return grid;
    }

    render() {
        const { side, halfDiagonal, stepOverhang, width, height } = choiceGridGeometry(this.props.gridSize);
        const diagonalTitle = this.props.gridSize >= DIAGONAL_TITLE_MIN_ITEMS;
        return (
        <div className={'ChoiceGridFrame' + (diagonalTitle ? ' ChoiceGridFrameDiagonal' : '')}>
            {!diagonalTitle && <div className='ChoiceGridHeading'>Choose between options</div>}
            {/* The canvas reserves exactly the space the rotated grid occupies on screen. */}
            <div className='ChoiceGridCanvas' style={{ width, height }}>
                <div
                    className='ChoiceGrid'
                    data-testid='choice-grid-id'
                    style={{ width: side, height: side, left: stepOverhang - side / 2, top: halfDiagonal - side / 2 }}
                >
                    {this.buildGrid()}
                    {diagonalTitle && <div className='ChoiceGridTitle' style={{ height: side }}>Choose Between Options</div>}
                </div>
            </div>
        </div>);
    }
}
