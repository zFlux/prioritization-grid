import React from 'react';

interface ResultGridProps {
    countOfOptions: number[]
    rankingsOfOptions: number[]
}

function buildRow(values: number[]) {
    let row = [];
    for (let i = 0; i < values.length-1; i++) {
        row.push(<div className='ResultGridCell' key={i}>{values[i+1]}</div>);
    }
    return row;
}

function buildTitleRow(countOfOptions: number[]) {
    let row = [];
    for (let i = 0; i < countOfOptions.length-1; i++) {
        row.push(<div className='ResultGridCellTitle' key={i}>{i+1}</div>);
    }
    return row;
}

export default class ResultGrid extends React.Component<ResultGridProps> {
    render() {
        return (
            <div className='ResultGrid'>
                <div className='ResultGridRow'>
                    {buildTitleRow(this.props.countOfOptions)}
                </div>
                <div className='ResultGridRow'>
                    {buildRow(this.props.countOfOptions)}
                </div>
                <div className='ResultGridRow'>
                    {buildRow(this.props.rankingsOfOptions)}
                </div>
            </div>
        );
    }
}   