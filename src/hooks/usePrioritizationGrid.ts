import { useState, useCallback } from 'react';
import { convertToItemNumbersInRankedOrder } from '../utils/utils';

// Types
interface HashTable<T> {
  [key: string]: T;
}

interface PrioritizationState {
  countOfSelectedItems: number[];
  listOfItems: string[];
  listOfResultItems: string[];
  rankingOfItems: number[];
  choiceGrid: HashTable<HashTable<number>>;
  largestEditedItemIndex: number;
  prioritiesTitle: string;
}

// Constants
const INITIAL_COUNT_OF_SELECTED_ITEMS = Array(11).fill(0);
const INITIAL_LIST_OF_RESULT_ITEMS = Array(11).fill('');
const INITIAL_LIST_OF_ITEMS = Array(11).fill('');
const INITIAL_RANKING_OF_ITEMS = Array(11).fill(0);

const INITIAL_STATE: PrioritizationState = {
  countOfSelectedItems: INITIAL_COUNT_OF_SELECTED_ITEMS,
  listOfItems: INITIAL_LIST_OF_ITEMS,
  listOfResultItems: INITIAL_LIST_OF_RESULT_ITEMS,
  rankingOfItems: INITIAL_RANKING_OF_ITEMS,
  choiceGrid: {},
  largestEditedItemIndex: 0,
  prioritiesTitle: ''
};

export const usePrioritizationGrid = () => {
  const [state, setState] = useState<PrioritizationState>(INITIAL_STATE);

  // Handle title changes
  const handlePrioritiesTitleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState(prevState => ({
      ...prevState,
      prioritiesTitle: event.currentTarget.value
    }));
  }, []);

  // Handle item list changes
  const handleItemListChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const index = Number.parseInt(event.currentTarget.id.split('_')[1]);
    const newItem = event.currentTarget.value;
    
    setState(prevState => {
      const updatedListOfItems = [...prevState.listOfItems];
      updatedListOfItems[index] = newItem;
      
      return {
        ...prevState,
        listOfItems: updatedListOfItems,
        largestEditedItemIndex: Math.max(prevState.largestEditedItemIndex, index)
      };
    });
  }, []);

  // Handle choice grid changes
  const setChosenValue = useCallback((choiceOne: number, choiceTwo: number, chosen: number) => {
    setState(prevState => {
      const choiceGrid = { ...prevState.choiceGrid };
      const keyOne = choiceOne.toString();
      if (!choiceGrid[keyOne]) {
        choiceGrid[keyOne] = {};
      }
      choiceGrid[keyOne][choiceTwo.toString()] = chosen;
      return { ...prevState, choiceGrid };
    });
  }, []);

  const getChosenValue = useCallback((choiceOne: number, choiceTwo: number): number => {
    const choiceGrid = state.choiceGrid;
    const keyOne = choiceOne.toString();
    if (choiceGrid[keyOne] && choiceGrid[keyOne][choiceTwo.toString()] !== undefined) {
      return choiceGrid[keyOne][choiceTwo.toString()];
    }
    return 0;
  }, [state.choiceGrid]);

  const updateCountOfSelectedItems = useCallback((selected: number, unSelected: number) => {
    setState(prevState => {
      const updatedItemCounts = [...prevState.countOfSelectedItems];
      updatedItemCounts[selected] = (updatedItemCounts[selected] || 0) + 1;
      updatedItemCounts[unSelected] = Math.max(0, (updatedItemCounts[unSelected] || 0) - 1);
      return { ...prevState, countOfSelectedItems: updatedItemCounts };
    });
  }, []);

  const handleChoiceGridChange = useCallback((firstOption: number, secondOption: number, selected: number) => {
    const currentVal = getChosenValue(firstOption, secondOption);
    
    if (currentVal === selected) {
      setChosenValue(firstOption, secondOption, 0);
      updateCountOfSelectedItems(0, selected);
    } else if (currentVal === 0) {
      setChosenValue(firstOption, secondOption, selected);
      updateCountOfSelectedItems(selected, 0);
    } else {
      setChosenValue(firstOption, secondOption, selected);
      updateCountOfSelectedItems(selected, currentVal);
    }

    // Update rankings and result items
    setState(prevState => {
      const itemNumbersInRankedOrder = convertToItemNumbersInRankedOrder(prevState.countOfSelectedItems);
      const updatedListOfResults = [...prevState.listOfItems];
      for (let i = 1; i < prevState.listOfItems.length; i++) {
        if (itemNumbersInRankedOrder[i]) {
          updatedListOfResults[i] = prevState.listOfItems[itemNumbersInRankedOrder[i]];
        }
      }
      return {
        ...prevState,
        rankingOfItems: itemNumbersInRankedOrder,
        listOfResultItems: updatedListOfResults
      };
    });
  }, [getChosenValue, setChosenValue, updateCountOfSelectedItems]);

  // File handling functions
  const handleImport = useCallback((jsonData: Partial<PrioritizationState>) => {
    setState(prevState => {
      const listOfItems = [...(jsonData.listOfItems || [])];
      listOfItems.unshift('');
      
      return {
        ...prevState,
        listOfItems,
        largestEditedItemIndex: jsonData.largestEditedItemIndex || 0,
        choiceGrid: jsonData.choiceGrid || {},
        prioritiesTitle: jsonData.prioritiesTitle || '',
        countOfSelectedItems: INITIAL_COUNT_OF_SELECTED_ITEMS
      };
    });
  }, []);

  const handleExport = useCallback(() => {
    const shiftedListOfItems = [...state.listOfItems];
    shiftedListOfItems.shift();
    
    const data = {
      choiceGrid: state.choiceGrid,
      listOfItems: shiftedListOfItems,
      largestEditedItemIndex: state.largestEditedItemIndex,
      prioritiesTitle: state.prioritiesTitle
    };
    
    const jsonData = JSON.stringify(data);
    const dataUri = `data:text/json;charset=utf-8,${encodeURIComponent(jsonData)}`;
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `${state.prioritiesTitle} Priorities.json`;
    link.click();
  }, [state]);

  return {
    state,
    handlePrioritiesTitleChange,
    handleItemListChange,
    handleChoiceGridChange,
    handleImport,
    handleExport
  };
}; 