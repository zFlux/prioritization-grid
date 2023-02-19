import React, { MouseEventHandler } from 'react';
import './ChoiceBox.scss';

const UNSELECTED = 0;

interface ChoiceBoxProps {
    firstOption: number;
    secondOption: number;
    onChange: (selected: number, unSelected: number) => void;
}

interface ChoiceBoxState {
    selected: number;
}

export default class ChoiceBox extends React.Component<ChoiceBoxProps, ChoiceBoxState> {
    state = {
        selected: UNSELECTED,
    }
    handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
        const clickedOption = event.currentTarget.textContent ? Number.parseInt(event.currentTarget.textContent) : 0;
        if (this.state.selected === clickedOption) {
            this.props.onChange(UNSELECTED, clickedOption);
            this.setState({ selected: UNSELECTED });
        } else {
            this.props.onChange(clickedOption, this.state.selected);
            this.setState({ selected: clickedOption });
        }
    }

    render() {
    return (
            <div className='ChoiceBox'>
                <div className='ChoiceBoxRow1'>
                    <div className={this.state.selected === this.props.firstOption ? 'ChoiceSelected' : 'Choice'} onClick={this.handleClick}>
                        {this.props.firstOption}
                    </div>
                </div>
                <div className='ChoiceBoxRow2'>
                    <div className={this.state.selected === this.props.secondOption ? 'ChoiceSelected' : 'Choice'} onClick={this.handleClick}>
                        {this.props.secondOption}
                    </div>
                </div>
            </div>
        );
    }
}