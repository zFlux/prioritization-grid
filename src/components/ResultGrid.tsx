import React from 'react';
import './ResultGrid.scss';

interface ResultGridProps {
    countOfSelectedItems: number[]
    rankingsOfItems: number[]
}

/** One item number with its count underneath. Pairs wrap onto new lines when space runs out. */
function buildPairs(countOfSelectedItems: number[]) {
    let pairs = [];
    for (let i = 1; i < countOfSelectedItems.length; i++) {
        pairs.push(
            <div className='ResultGridPair' key={i}>
                <div className='ResultGridCellTitle'>{i}</div>
                <div className='ResultGridCell'>{countOfSelectedItems[i]}</div>
            </div>
        );
    }
    return pairs;
}

export default class ResultGrid extends React.Component<ResultGridProps> {
    render() {
        return (
            <div className='ResultGrid'>
                <div className='ResultGridTitle'>Counts</div>
                <div className='ResultGridPairs'>
                    {buildPairs(this.props.countOfSelectedItems)}
                </div>
            </div>
        );
    }
}
