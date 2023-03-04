import React from 'react';
import ItemField from './ItemField';
import './ItemList.scss'

interface ItemListProps {
    itemCount: number;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    largestEditedItemIndex: number;
    itemList: string[];
}

function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let nextInput = document.getElementById('item_' + (parseInt(event.currentTarget.id.split('_')[1]) + 1));
        if (nextInput) nextInput.focus();
    }
}

export default class ItemList extends React.Component<ItemListProps> {

    render() {
        let itemFields = [];
        for (let i = 1; i <= this.props.itemCount; i++) {
            let className = 'ItemFieldDisabled';
            if (i === 1 || i <= this.props.largestEditedItemIndex + 1) {
                className = 'ItemField';
            }
            itemFields.push(<ItemField className={className} key={"item_" + i} itemID={i} onChange={this.props.onChange} onKeyDown={handleKeyDown} value={this.props.itemList[i]}/>);
        }
        return (
            <div>
                <form className='ItemList'>
                <h3 className='ItemListTitle'>Unprioritized</h3>
                <div className='ItemListTitleSubtext'>Before prioritizing - enter items in any order</div>
                    {itemFields}
                </form>
            </div>
        );
    }
}       