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
            <div>
                <div className='ResultGridTitle'>Section C</div>
                <div className='ResultGrid'>
                    <div className='ResultGridItemNumber'>
                        {buildTitleRow(this.props.countOfSelectedItems)}
                        <div className='ResultGridRowTitle'>Item <div className='TitleEmphasis'>&nbsp;number&nbsp;</div> from Section A</div>
                    </div>
                    <div className='ResultGridSelected'>
                        {buildRow(this.props.countOfSelectedItems)}
                        <div className='ResultGridRowTitle'>How many <div className='TitleEmphasis'>&nbsp;times&nbsp;</div> circled in Section B</div>
                    </div>
                    <div className='ResultGridRanked'>
                        {buildRow(this.props.rankingsOfItems)}
                        <div className='ResultGridRowTitle'>Final <div className='TitleEmphasis'>&nbsp;rank&nbsp;</div> for Section D</div>
                    </div>
                </div>
            </div>
        );
    }
}   