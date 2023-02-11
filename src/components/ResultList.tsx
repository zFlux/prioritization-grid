import React from 'react';
import OptionBox from './OptionBox';

interface ResultListProps {
    resultList: string[];
}

export default class ResultList extends React.Component<ResultListProps> {
    render() {
        let optionBoxes = [];
        for (let i = 1; i < this.props.resultList.length; i++) {
            optionBoxes.push(<OptionBox key={"result_" + i} optionID={i} value={this.props.resultList[i]} readOnly={true} />);
        }
        return (
            <div className='ResultList'>
                {optionBoxes}
            </div>
        );
    }
}   