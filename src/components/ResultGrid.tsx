import React from 'react';
import './ResultGrid.scss';

interface ResultGridProps {
    countOfSelectedItems: number[]
    rankingsOfItems: number[]
}

function buildRow(values: number[]) {
    let row = [];
    for (let i = 0; i < values.length-1; i++) {
        row.push(<div className='ResultGridCell' key={i}>{values[i+1]}</div>);
    }
    return row;
}

function buildTitleRow(countOfSelectedItems: number[]) {
    let row = [];
    for (let i = 0; i < countOfSelectedItems.length-1; i++) {
        row.push(<div className='ResultGridCellTitle' key={i}>{i+1}</div>);
    }
    return row;
}

export default class ResultGrid extends React.Component<ResultGridProps> {
    render() {
        return (
            <div className='ResultGrid'>
                <div className='ResultGridTitle'>Counts</div>
                <div>
                    <div className='ResultGridItemNumber'>
                        {buildTitleRow(this.props.countOfSelectedItems)}
                    </div>
                    <div className='ResultGridSelected'>
                        {buildRow(this.props.countOfSelectedItems)}
                    </div>
                </div>
            </div>
        );
    }
}   