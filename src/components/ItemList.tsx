import React from 'react';
import ItemField from './ItemField';
import './ItemList.scss'

interface ItemListProps {
    itemCount: number;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
            itemFields.push(<ItemField key={"item_" + i} itemID={i} onChange={this.props.onChange} onKeyDown={handleKeyDown}/>);
        }
        return (
            <div>
                <form className='ItemList'>
                <h3 className='ItemListTitle'>Section A</h3>
                <div className='ItemListTitleSubtext'>Before prioritzing - items in any order</div>
                    {itemFields}
                </form>
            </div>
        );
    }
}       