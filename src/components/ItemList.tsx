import React from 'react';
import ItemField from './ItemField';
import './ItemList.scss'

interface ItemListProps {
    itemCount: number;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    itemList: string[];
}

// function to intercept an pressing enter key and increment the focus of to the next input box
function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
        let nextInput = document.getElementById('item_' + (parseInt(event.currentTarget.id.split('_')[1]) + 1));
        if (nextInput) nextInput.focus();
    }
}

export default class ItemList extends React.Component<ItemListProps> {
    render() {
        let itemFields = [];
        for (let i = 1; i <= this.props.itemCount; i++) {
            let className = 'ItemFieldDisabled';
            if ((i-1 > 0 && this.props.itemList[i-1] !== '') || i === 1) {
                className = 'ItemField';
            }
            itemFields.push(<ItemField className={className} key={"item_" + i} itemID={i} onChange={this.props.onChange} onKeyDown={handleKeyDown}/>);
        }
        return (
            <div>
                <form className='ItemList'>
                <h3 className='ItemListTitle'>Unprioritized</h3>
                <div className='ItemListTitleSubtext'>Before prioritzing - enter items in any order</div>
                    {itemFields}
                </form>
            </div>
        );
    }
}       