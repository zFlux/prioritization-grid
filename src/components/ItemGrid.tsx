import React, { ChangeEvent } from 'react';
import ItemList from './ItemList';
import ResultList from './ResultList';
import './ItemGrid.scss';

interface ItemGridProps {
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    resultList: string[];

}

export default class ItemField extends React.Component<ItemGridProps> {
    render() {
        return (
            <div className='ItemGrid'>
                <ItemList itemCount={10} onChange={this.props.onChange}/>
                <ResultList resultList={this.props.resultList} />
            </div>
        );
    }

}