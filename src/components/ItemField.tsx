import React from 'react';
import './ItemField.scss';

interface ItemFieldProps {
    itemID: number;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    value?: string;
    readOnly?: boolean;
}

function formatedItemID(itemID: number) {
    if (itemID < 10) {
        return <>&nbsp; {itemID}</>;
    }
    return itemID;
}

export default class ItemField extends React.Component<ItemFieldProps> {
    render() {
        return (
            <div className='ItemField'>
                <label className='ItemLabel'>{formatedItemID(this.props.itemID)}</label>
                <textarea className='ItemTextbox' value={this.props.value} readOnly={this.props.readOnly} id={'item_' + this.props.itemID.toString()} onChange={this.props.onChange} onKeyDown={this.props.onKeyDown} />
            </div>
        );
    }
}

