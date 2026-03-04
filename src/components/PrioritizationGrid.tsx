import React, { type ChangeEvent } from 'react';
import ChoiceGrid from './ChoiceGrid';
import ResultGrid from './ResultGrid';
import { replaceAt, convertToItemNumbersInRankedOrder, type HashTable } from '../utils/utils';
import './PrioritizationGrid.scss';
import ItemGrid from './ItemGrid';

const INITIAL_COUNT_OF_SELECTED_ITEMS = [0,0,0,0,0,0,0,0,0,0,0];
const INITIAL_LIST_OF_RESULT_ITEMS = ['', '', '', '', '', '', '', '', '', '', ''];
const INITIAL_LIST_OF_ITEMS = ['', '', '', '', '', '', '', '', '', '', ''];
const INITIAL_RANKING_OF_ITEMS = [0,0,0,0,0,0,0,0,0,0,0];

interface PrioritizationGridProps { }

interface PrioritizationGridState {
    countOfSelectedItems: number[];
    listOfItems: string[];
    listOfResultItems: string[];
    rankingOfItems: number[];
    choiceGrid: HashTable<HashTable<number>>;
    largestEditedItemIndex: number;
    prioritiesTitle: string;
}

export default class PrioritizationGrid extends React.Component<PrioritizationGridProps,PrioritizationGridState> {

    focusRef = React.createRef<HTMLTextAreaElement>();

    componentDidMount() {
      this.focusRef.current?.focus();
    }

    constructor(props: PrioritizationGridProps) {
        super(props);
        this.state = {
            countOfSelectedItems: INITIAL_COUNT_OF_SELECTED_ITEMS,
            listOfItems: INITIAL_LIST_OF_ITEMS,
            listOfResultItems: INITIAL_LIST_OF_RESULT_ITEMS,
            rankingOfItems: INITIAL_RANKING_OF_ITEMS,
            choiceGrid: {},
            largestEditedItemIndex: 0,
            prioritiesTitle: ''
        }
        this.itemListChange = this.itemListChange.bind(this);
        this.choiceGridChange = this.choiceGridChange.bind(this);
        this.handleFileInputChange = this.handleFileInputChange.bind(this);
        this.setChosenValue = this.setChosenValue.bind(this);
        this.getChosenValue = this.getChosenValue.bind(this);
        this.handlePrioritiesTitleChange = this.handlePrioritiesTitleChange.bind(this);
    }

    handlePrioritiesTitleChange(event: ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ prioritiesTitle: event.currentTarget.value });
    }

    setChosenValue(choiceOne: number, choiceTwo: number, chosen: number) {
        const choiceGrid = this.state.choiceGrid;
        if (!choiceGrid[choiceOne]) {
          choiceGrid[choiceOne] = {};
        }
        choiceGrid[choiceOne][choiceTwo] = chosen;
        this.setState({ choiceGrid: choiceGrid });
      }
      
    getChosenValue(choiceOne: number, choiceTwo: number): number {
        const choiceGrid = this.state.choiceGrid;
        if (choiceGrid[choiceOne] && choiceGrid[choiceOne][choiceTwo] !== undefined) {
          return choiceGrid[choiceOne][choiceTwo];
        }
        return 0;
      }

    itemListChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const index = Number.parseInt(event.currentTarget.id.split('_')[1]);
        const newItem = event.currentTarget.value;
        const updatedListOfItems = replaceAt(this.state.listOfItems, index, newItem);
        this.setState({ listOfItems: updatedListOfItems });
        let largestEditedItemIndex = Math.max(this.state.largestEditedItemIndex, index);
        this.setState({ largestEditedItemIndex: largestEditedItemIndex });
    }

    updateCountOfSelectedItemsFromChoiceGrid() {
        let updatedCountOfSelectedItems = INITIAL_COUNT_OF_SELECTED_ITEMS;
        for (let i = 1; i <= 10; i++) {
            for (let j = 1; j <= 10; j++) {
                if (i !== j) {
                    const currentVal = this.getChosenValue(i, j);
                    if (currentVal !== 0) {
                        updatedCountOfSelectedItems[currentVal]++;
                    }
                }
            }
        }
        this.setState({ countOfSelectedItems: updatedCountOfSelectedItems });
    }

    choiceGridChange(firstOption: number, secondOption: number, selected: number) { 
        const currentVal = this.getChosenValue(firstOption, secondOption);
        if (currentVal === selected) {
            this.setChosenValue(firstOption, secondOption, 0);
            this.updateCountOfSelectedItems(0, selected);
        }  else if (currentVal === 0) {
            this.setChosenValue(firstOption, secondOption, selected);
            this.updateCountOfSelectedItems(selected, 0);
        } else {
            this.setChosenValue(firstOption, secondOption, selected);
            this.updateCountOfSelectedItems(selected, currentVal);
        }

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
        const itemNumbersInRankedOrder = 
            convertToItemNumbersInRankedOrder(this.state.countOfSelectedItems);
        this.setState({rankingOfItems: itemNumbersInRankedOrder});
        return itemNumbersInRankedOrder;
    }

    updateListOfResultItems(updatedItemRankings: number[]) {
        let updatedListOfResults= [...this.state.listOfItems];
        for (let i = 1; i < this.state.listOfItems.length; i++) {
            if (updatedItemRankings[i]) updatedListOfResults[i] = this.state.listOfItems[updatedItemRankings[i]];
        }
        this.setState({listOfResultItems: updatedListOfResults});
    }

    handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        const setState = this.setState.bind(this);
        const updateItemRankings = this.updateItemRankings.bind(this);
        const updateListOfResultItems = this.updateListOfResultItems.bind(this);
        const updateCountOfSelectedItemsFromChoiceGrid = this.updateCountOfSelectedItemsFromChoiceGrid.bind(this);

        function handleFileLoad(event: ProgressEvent<FileReader>) {
            const jsonData = JSON.parse(event.target?.result?.toString() || '');
            let listOfItems = jsonData.listOfItems;
            listOfItems.unshift('');
            setState({listOfItems: listOfItems, largestEditedItemIndex: jsonData.largestEditedItemIndex,choiceGrid: jsonData.choiceGrid, prioritiesTitle: jsonData.prioritiesTitle, countOfSelectedItems: INITIAL_COUNT_OF_SELECTED_ITEMS},
                function() {
                    updateCountOfSelectedItemsFromChoiceGrid();
                    const updatedItemRankings = updateItemRankings();
                    updateListOfResultItems(updatedItemRankings);
                }
                );  

        }

        if (file) {
          const reader = new FileReader();
          reader.onload = handleFileLoad;
          reader.readAsText(file);
        }
    }

    exportJsonData(listOfItems: string[], choiceGrid: HashTable<HashTable<number>>, largestEditedItemIndex: number, prioritiesTitle: string) {
        let shiftedListOfItems = [...listOfItems];
        shiftedListOfItems.shift();
        const data = { choiceGrid: choiceGrid, listOfItems: shiftedListOfItems, largestEditedItemIndex: largestEditedItemIndex, prioritiesTitle: prioritiesTitle };
        const jsonData = JSON.stringify(data);
        const dataUri = `data:text/json;charset=utf-8,${encodeURIComponent(jsonData)}`;
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = this.state.prioritiesTitle + ' Priorities.json';
        link.click();
    }

    render() {
        return (
            <div className='PrioritizationGrid' data-testid='prioritization-grid-id'>
                <div className='ItemGridAndChoiceGridContainer'>
                    <ItemGrid itemList={this.state.listOfItems} largestEditedItemIndex={this.state.largestEditedItemIndex} resultList={this.state.listOfResultItems} onChange={this.itemListChange} />
                    <ChoiceGrid gridSize={10} choiceGridData={this.state.choiceGrid} largestEditedItemIndex={this.state.largestEditedItemIndex} onChange={this.choiceGridChange} />
                </div>
                <ResultGrid countOfSelectedItems={this.state.countOfSelectedItems} rankingsOfItems={this.state.rankingOfItems} />
            </div>
        );
    }
}   