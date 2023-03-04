import React, { MouseEventHandler } from 'react';
import './ChoiceBox.scss';

interface ChoiceBoxProps {
    firstOption: number;
    secondOption: number;
    selected: number;
    selectable: boolean;
    onChange: (firstChoice: number, secondChoice: number, chosen: number) => void;
}

export default class ChoiceBox extends React.Component<ChoiceBoxProps> {

    handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
        const clickedOption = event.currentTarget.textContent ? Number.parseInt(event.currentTarget.textContent) : 0;
        this.props.onChange(this.props.firstOption, this.props.secondOption, clickedOption);
    }

    render() {
    const { selected } = this.props;
    const { firstOption, secondOption, selectable } = this.props;

    const firstSelectedClass = selected === firstOption ? 'ChoiceSelected' : 'Choice';
    const secondSelectedClass = selected === secondOption ? 'ChoiceSelected' : 'Choice';
    const firstChoiceClass = selectable ? firstSelectedClass : 'ChoiceDisabled';
    const secondChoiceClass = selectable ? secondSelectedClass : 'ChoiceDisabled';

    return (
            <div className='ChoiceBox'>
                <div className='ChoiceBoxRow1'>
                    <div className={firstChoiceClass} onClick={selectable ? this.handleClick : ()=>{}}>
                        {this.props.firstOption}
                    </div>
                </div>
                <div className='ChoiceBoxRow2'>
                    <div className={secondChoiceClass} onClick={selectable ? this.handleClick  : ()=>{}}>
                        {this.props.secondOption}
                    </div>
                </div>
            </div>
        );
    }
}