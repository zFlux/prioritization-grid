import React from 'react';
import OptionBox from './OptionBox';

interface OptionListProps {
    optionCount: number;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

// function to intercept an pressing enter key and increment the focus of to the next input box
function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
        let nextInput = document.getElementById('option_' + (parseInt(event.currentTarget.id.split('_')[1]) + 1));
        if (nextInput) nextInput.focus();
    }
}

export default class OptionList extends React.Component<OptionListProps> {
    render() {
        let optionBoxes = [];
        for (let i = 1; i <= this.props.optionCount; i++) {
            optionBoxes.push(<OptionBox key={"option_" + i} optionID={i} onChange={this.props.onChange} onKeyDown={handleKeyDown}/>);
        }
        return (
            <form className='OptionList'>
                {optionBoxes}
            </form>
        );
    }
}       