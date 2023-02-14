import React from 'react';
import ChoiceGrid from './ChoiceGrid';
import ItemList from './ItemList';
import ResultGrid from './ResultGrid';
import ResultList from './ResultList';

interface PrioritizationGridProps { }

interface PrioritizationGridState {
    countOfSelectedItems: number[];
    listOfItems: string[];
    listOfResultItems: string[];
    rankingOfItems: number[];
}

export default class PrioritizationGrid extends React.Component<PrioritizationGridProps,PrioritizationGridState> {

    constructor(props: PrioritizationGridProps) {
        super(props);
        this.state = {
            countOfSelectedItems: [0,0,0,0,0,0,0,0,0,0,0],
            listOfItems: ['', '', '', '', '', '', '', '', '', '', ''],
            listOfResultItems: ['', '', '', '', '', '', '', '', '', '', ''],
            rankingOfItems: [0,0,0,0,0,0,0,0,0,0,0]
        }
        this.optionListChange = this.optionListChange.bind(this);
        this.choiceGridChange = this.choiceGridChange.bind(this);
    }

    optionListChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        let updatedListOfItems = [...this.state.listOfItems];
        updatedListOfItems[Number.parseInt(event.currentTarget.id.split('_')[1])] = event.currentTarget.value;
        this.setState({ listOfItems: updatedListOfItems });
    }

    choiceGridChange(selected: number, unSelected: number) {    
        this.updateCountOfSelectedItems(selected, unSelected);
        const updatedItemRankings = this.updateItemRankings(selected, unSelected);
        this.updateListOfResultItems(updatedItemRankings);
    }

    updateCountOfSelectedItems(selected: number, unSelected: number) {
        let updatedItemCounts = this.state.countOfSelectedItems;
        updatedItemCounts[selected] ? updatedItemCounts[selected]++ : updatedItemCounts[selected] = 1;
        updatedItemCounts[unSelected] ? updatedItemCounts[unSelected]-- : updatedItemCounts[unSelected] = 0;
        this.setState({ countOfSelectedItems: updatedItemCounts });
    }

    updateItemRankings(selected: number, unSelected: number) {
        let updatedRankingOfItems:[number[]] = [[]];
        for (let i = 1; i < this.state.countOfSelectedItems.length; i++) {
            if(!updatedRankingOfItems[this.state.countOfSelectedItems[i]]) updatedRankingOfItems[this.state.countOfSelectedItems[i]] = [];
            updatedRankingOfItems[this.state.countOfSelectedItems[i]].push(i);
        }
        
        let reversedAndFlattend: number[] = updatedRankingOfItems.reverse().flat() 
        reversedAndFlattend.unshift(0);
        this.setState({rankingOfItems: reversedAndFlattend});
        return reversedAndFlattend;
    }

    updateListOfResultItems(updatedItemRankings: number[]) {
        let updatedListOfResults= [...this.state.listOfItems];
        for (let i = 1; i < this.state.listOfItems.length; i++) {
            if (updatedItemRankings[i]) updatedListOfResults[i] = this.state.listOfItems[updatedItemRankings[i]];
        }
        this.setState({listOfResultItems: updatedListOfResults});
    }

    render() {
        return (
            <div className='PrioritizationGrid' data-testid='prioritization-grid-id'>
                <ItemList itemCount={10} onChange={this.optionListChange}/>
                <ResultList resultList={this.state.listOfResultItems} />
                <ChoiceGrid gridSize={10} onChange={this.choiceGridChange} />
                <ResultGrid countOfSelectedItems={this.state.countOfSelectedItems} rankingsOfItems={this.state.rankingOfItems} />
            </div>
        );
    }
}   