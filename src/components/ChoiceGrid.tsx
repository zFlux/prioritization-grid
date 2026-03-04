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
        return (
        <div className='ChoiceGrid' data-testid='choice-grid-id'>
            {this.buildGrid()}
            <div className='ChoiceGridTitle'>Choose Between Options</div>
        </div>);
    }
}