import React from 'react';
import ItemField from './ItemField';

interface ResultListProps {
    resultList: string[];
}

export default class ResultList extends React.Component<ResultListProps> {
    render() {
        let optionBoxes = [];
        for (let i = 1; i < this.props.resultList.length; i++) {
            optionBoxes.push(<ItemField key={"result_" + i} itemID={i} value={this.props.resultList[i]} readOnly={true} />);
        }
        return (
            <div className='ResultList'>
                {optionBoxes}
            </div>
        );
    }
}   