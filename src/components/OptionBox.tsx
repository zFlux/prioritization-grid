import React from 'react';

interface OptionBoxProps {
    optionID: number;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    value?: string;
    readOnly?: boolean;
}

function formatedOptionID(optionID: number) {
    if (optionID < 10) {
        return <>&nbsp; {optionID}</>;
    }
    return optionID;
}

export default class OptionBox extends React.Component<OptionBoxProps> {
    render() {
        return (
            <div className='OptionBox'>
                <label className='OptionLabel'>{formatedOptionID(this.props.optionID)}</label>
                <textarea className='OptionTextbox' value={this.props.value} readOnly={this.props.readOnly} id={'option_' + this.props.optionID.toString()} onChange={this.props.onChange} onKeyDown={this.props.onKeyDown} />
            </div>
        );
    }
}

