import React from 'react';
import ChoiceGrid from './ChoiceGrid';
import ItemList from './ItemList';
import ResultGrid from './ResultGrid';
import ResultList from './ResultList';
import { replaceAt } from '../utils/utils';

const INITIAL_COUNT_OF_SELECTED_ITEMS = [0,0,0,0,0,0,0,0,0,0,0];
const INITIAL_LIST_OF_ITEMS = ['', '', '', '', '', '', '', '', '', '', ''];
const INITIAL_LIST_OF_RESULT_ITEMS = ['', '', '', '', '', '', '', '', '', '', ''];
const INITIAL_RANKING_OF_ITEMS = [0,0,0,0,0,0,0,0,0,0,0];

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
            countOfSelectedItems: INITIAL_COUNT_OF_SELECTED_ITEMS,
            listOfItems: INITIAL_LIST_OF_ITEMS,
            listOfResultItems: INITIAL_LIST_OF_RESULT_ITEMS,
            rankingOfItems: INITIAL_RANKING_OF_ITEMS
        }
        this.itemListChange = this.itemListChange.bind(this);
        this.choiceGridChange = this.choiceGridChange.bind(this);
    }

    itemListChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const index = Number.parseInt(event.currentTarget.id.split('_')[1]);
        const newItem = event.currentTarget.value;
        const updatedListOfItems = replaceAt(this.state.listOfItems, index, newItem);
        this.setState({ listOfItems: updatedListOfItems });
    }

    choiceGridChange(selected: number, unSelected: number) {    
        this.updateCountOfSelectedItems(selected, unSelected);
        const updatedItemRankings = this.updateItemRankings();
        this.updateListOfResultItems(updatedItemRankings);
    }

    updateCountOfSelectedItems(selected: number, unSelected: number) {
        let updatedItemCounts = this.state.countOfSelectedItems;
        updatedItemCounts[selected] ? updatedItemCounts[selected]++ : updatedItemCounts[selected] = 1;
        updatedItemCounts[unSelected] ? updatedItemCounts[unSelected]-- : updatedItemCounts[unSelected] = 0;
        this.setState({ countOfSelectedItems: updatedItemCounts });
    }

    updateItemRankings() {
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
                <div className='PrioritizationGridTitle'>Prioritizing Grid For 10 Items Or Fewer</div>
                <ItemList itemCount={10} onChange={this.itemListChange}/>
                <ResultList resultList={this.state.listOfResultItems} />
                <ChoiceGrid gridSize={10} onChange={this.choiceGridChange} />
                <ResultGrid countOfSelectedItems={this.state.countOfSelectedItems} rankingsOfItems={this.state.rankingOfItems} />
            </div>
        );
    }
}   