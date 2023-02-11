import React from 'react';
import ChoiceGrid from './ChoiceGrid';
import ItemList from './ItemList';
import ResultGrid from './ResultGrid';
import ResultList from './ResultList';

interface PrioritizationGridProps { }

interface PrioritizationGridState {
    countOfOptions: number[];
    listOfOptions: string[];
    listOfResults: string[];
    rankingOfOptions: number[];
}

export default class PrioritizationGrid extends React.Component<PrioritizationGridProps,PrioritizationGridState> {

    constructor(props: PrioritizationGridProps) {
        super(props);
        this.state = {
            countOfOptions: [0,0,0,0,0,0,0,0,0,0,0],
            listOfOptions: ['', '', '', '', '', '', '', '', '', '', ''],
            listOfResults: ['', '', '', '', '', '', '', '', '', '', ''],
            rankingOfOptions: [0,0,0,0,0,0,0,0,0,0,0]
        }
        this.optionListChange = this.optionListChange.bind(this);
        this.choiceGridChange = this.choiceGridChange.bind(this);
    }

    optionListChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        let mutateListOfOptions = [...this.state.listOfOptions];
        mutateListOfOptions[Number.parseInt(event.currentTarget.id.split('_')[1])] = event.currentTarget.value;
        this.setState({ listOfOptions: mutateListOfOptions });
    }

    choiceGridChange(selected: number, unSelected: number) {    
        let mutateCountOptions = this.state.countOfOptions;
        mutateCountOptions[selected] ? mutateCountOptions[selected]++ : mutateCountOptions[selected] = 1;
        mutateCountOptions[unSelected] ? mutateCountOptions[unSelected]-- : mutateCountOptions[unSelected] = 0;
        this.setState({ countOfOptions: mutateCountOptions });

        let mutateRankingsOfOptions:[number[]] = [[]];
        for (let i = 1; i < this.state.countOfOptions.length; i++) {
            if(!mutateRankingsOfOptions[this.state.countOfOptions[i]]) mutateRankingsOfOptions[this.state.countOfOptions[i]] = [];
            mutateRankingsOfOptions[this.state.countOfOptions[i]].push(i);
        }
        let reversedAndFlattend: number[] = mutateRankingsOfOptions.reverse().flat() 
        reversedAndFlattend.unshift(0);
        this.setState({rankingOfOptions: reversedAndFlattend});

        let mutateListOfResults = [...this.state.listOfOptions];
        for (let i = 1; i < this.state.listOfOptions.length; i++) {

            if (reversedAndFlattend[i]) mutateListOfResults[i] = this.state.listOfOptions[reversedAndFlattend[i]];
        }
        this.setState({listOfResults: mutateListOfResults});
    }

    render() {
        return (
            <div className='PrioritizationGrid'>
                <ItemList itemCount={10} onChange={this.optionListChange}/>
                <ResultList resultList={this.state.listOfResults} />
                <ChoiceGrid gridSize={10} onChange={this.choiceGridChange} />
                <ResultGrid countOfOptions={this.state.countOfOptions} rankingsOfOptions={this.state.rankingOfOptions} />
            </div>
        );
    }
}   