import React, { ChangeEvent } from 'react';
import ItemList from './ItemList';
import ResultList from './ResultList';
import './ItemGrid.scss';

interface ItemGridProps {
    maxItems: number;
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    resultList: string[];
    itemList: string[];
    largestEditedItemIndex: number;
}

export default class ItemField extends React.Component<ItemGridProps> {
    render() {
        return (
            <div className='ItemGrid'>
                <ItemList itemCount={this.props.maxItems}  itemList={this.props.itemList} largestEditedItemIndex={this.props.largestEditedItemIndex} onChange={this.props.onChange}/>
                <ResultList resultCount={this.props.maxItems} resultList={this.props.resultList} />
            </div>
        );
    }

}