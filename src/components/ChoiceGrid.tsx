import React from 'react';
import ChoiceBox from './ChoiceBox';

interface ChoiceGridProps {
    gridSize: number;
    onChange: (selected: number, unSelected: number) => void;
}

export default class ChoiceGrid extends React.Component<ChoiceGridProps> {
    buildGrid() { 
        let grid = [];
        for (let i = 1; i <= this.props.gridSize; i++) {
            let row = [];
            for (let j = 1 ; j <= this.props.gridSize - i; j++) {
                row.push(<ChoiceBox key={j + " " + i} firstOption={i} secondOption={j+i} onChange={this.props.onChange} />);
            }
            grid.push(<div className={'ChoiceGridColumn' + i} key={i}>{row}</div>);
        }
        return grid;
    }

    render() {
        return (<div data-testid='choice-grid-id'>{this.buildGrid()}</div>);
    }
}