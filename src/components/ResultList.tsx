import React from 'react';
import ItemField from './ItemField';
import './ResultList.scss';

interface ResultListProps {
    resultCount: number;
    resultList: string[];
}

export default class ResultList extends React.Component<ResultListProps> {
    render() {
        let optionBoxes = [];
        for (let i = 1; i <= this.props.resultCount; i++) {
            optionBoxes.push(<ItemField className="ItemFieldDisabled" key={"result_" + i} itemID={i} value={this.props.resultList[i]} readOnly={true} />);
        }
        return (
            <div className='ResultList'>
                <h3 className='ResultListTitle'>Prioritized</h3>
                <div className='ResultListTitleSubtext'>After prioritizing - items in final order</div>
                {optionBoxes}
            </div>
        );
    }
}   