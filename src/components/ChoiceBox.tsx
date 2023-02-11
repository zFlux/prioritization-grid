import React, { MouseEventHandler } from 'react';

interface ChoiceBoxProps {
    firstOption: number;
    secondOption: number;
    onChange: (selected: number, unSelected: number) => void;
}

interface ChoiceBoxState {
    selected: string;
}

export default class ChoiceBox extends React.Component<ChoiceBoxProps, ChoiceBoxState> {
    state = {
        selected: '',
    }
    handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
        const selectedAndUnselected = event.currentTarget.id.split("_")
        if (this.state.selected !== selectedAndUnselected[0]) {
            this.setState({ selected: selectedAndUnselected[0] });
            if (this.state.selected !== '') {
                this.props.onChange(Number.parseInt(selectedAndUnselected[0]), Number.parseInt(selectedAndUnselected[1]));
            } else {
                this.props.onChange(Number.parseInt(selectedAndUnselected[0]), 0);
            }
        } else {
            this.setState({ selected: '' });
            this.props.onChange(0, Number.parseInt(selectedAndUnselected[0]))
        }
    }

    render() {
    return (
            <div className='ChoiceBox'>
                <div className='ChoiceBoxRow1'>
                    <div className={this.state.selected === this.props.firstOption.toString() ? 'ChoiceSelected' : 'Choice'} id={this.props.firstOption.toString() + "_" + this.props.secondOption.toString()} onClick={this.handleClick}>
                        {this.props.firstOption}
                    </div>
                </div>
                <div className='ChoiceBoxRow2'>
                    <div className={this.state.selected === this.props.secondOption.toString() ? 'ChoiceSelected' : 'Choice'} id={this.props.secondOption.toString() + "_" + this.props.firstOption.toString()} onClick={this.handleClick}>
                        {this.props.secondOption}
                    </div>
                </div>
            </div>
        );
    }
}