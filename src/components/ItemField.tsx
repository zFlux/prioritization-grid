import React from 'react';
import './ItemField.scss';

interface ItemFieldProps {
    itemID: number;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    className: string;
    value?: string;
    readOnly?: boolean;
}

export default class ItemField extends React.Component<ItemFieldProps> {
    render() {
        let disabled = this.props.className === 'ItemFieldDisabled';
        let disabledTextbox = disabled ? 
            <textarea className='ItemTextbox' disabled value={this.props.value} readOnly={this.props.readOnly} id={'item_' + this.props.itemID.toString()} onChange={this.props.onChange} onKeyDown={this.props.onKeyDown} /> :
            <textarea className='ItemTextbox' autoFocus value={this.props.value} readOnly={this.props.readOnly} id={'item_' + this.props.itemID.toString()} onChange={this.props.onChange} onKeyDown={this.props.onKeyDown} />
        ;
        return (
            <div className={this.props.className}>
                <label className='ItemLabel'>{this.props.itemID}</label>
                {disabledTextbox}
            </div>
        );
    }
}

