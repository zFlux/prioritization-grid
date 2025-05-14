import { useState, useCallback } from 'react';
import { convertToItemNumbersInRankedOrder } from '../utils/utils';
import { PrioritizationState } from '../types/prioritization';

// ===== CONSTANTS =====
const GRID_SIZE = 11; // We use arrays of length 11 because we want indices 1-10 for items (index 0 is unused)

// ===== INITIAL STATE VALUES =====
const INITIAL_COUNT_OF_SELECTED_ITEMS = Array(GRID_SIZE).fill(0);
const INITIAL_LIST_OF_RESULT_ITEMS = Array(GRID_SIZE).fill('');
const INITIAL_LIST_OF_ITEMS = Array(GRID_SIZE).fill('');
const INITIAL_RANKING_OF_ITEMS = Array(GRID_SIZE).fill(0);

const INITIAL_STATE: PrioritizationState = {
  countOfSelectedItems: INITIAL_COUNT_OF_SELECTED_ITEMS,
  listOfItems: INITIAL_LIST_OF_ITEMS,
  listOfResultItems: INITIAL_LIST_OF_RESULT_ITEMS,
  rankingOfItems: INITIAL_RANKING_OF_ITEMS,
  choiceGrid: {},
  largestEditedItemIndex: 0,
  prioritiesTitle: ''
};

// ===== UTILITY FUNCTIONS =====
/**
 * Creates a data URI for downloading JSON data
 */
const createDataUri = (data: any): string => {
  const jsonData = JSON.stringify(data);
  return `data:text/json;charset=utf-8,${encodeURIComponent(jsonData)}`;
};

/**
 * Updates the result list based on the current rankings
 */
const updateResultList = (listOfItems: string[], itemNumbersInRankedOrder: number[]): string[] => {
  const updatedListOfResults = Array(listOfItems.length).fill('');
  for (let i = 1; i < listOfItems.length; i++) {
    const rankedIndex = itemNumbersInRankedOrder[i];
    if (rankedIndex && listOfItems[rankedIndex]) {
      updatedListOfResults[i] = listOfItems[rankedIndex];
    }
  }
  return updatedListOfResults;
};

// ===== MAIN HOOK =====
/**
 * Custom hook that manages the state and logic for the prioritization grid
 * Returns the current state and functions to modify it
 */
export const usePrioritizationGrid = () => {
  const [state, setState] = useState<PrioritizationState>(INITIAL_STATE);

  // ===== EVENT HANDLERS =====
  /**
   * Updates the title of the prioritization exercise
   * Called when user types in the title textarea
   */
  const handlePrioritiesTitleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState(prevState => ({
      ...prevState,
      prioritiesTitle: event?.currentTarget?.value
    }));
  }, []);

  /**
   * Updates an item in the list when user edits it
   * Also tracks the highest index that has been edited
   */
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

  // ===== CHOICE GRID MANAGEMENT =====
  /**
   * Stores a choice in the grid
   * Example: setChosenValue(1, 2, 1) means "item 1 was chosen over item 2"
   */
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

  /**
   * Retrieves a choice from the grid
   * Returns 0 if no choice has been made
   */
  const getChosenValue = useCallback((choiceOne: number, choiceTwo: number): number => {
    const choiceGrid = state.choiceGrid;
    const keyOne = choiceOne.toString();
    if (choiceGrid[keyOne] && choiceGrid[keyOne][choiceTwo.toString()] !== undefined) {
      return choiceGrid[keyOne][choiceTwo.toString()];
    }
    return 0;
  }, [state.choiceGrid]);

  /**
   * Updates the count of how many times each item was chosen
   * Called when a new choice is made or an existing choice is changed
   */
  const updateCountOfSelectedItems = useCallback((selected: number, unSelected: number) => {
    setState(prevState => {
      const updatedItemCounts = [...prevState.countOfSelectedItems];
      updatedItemCounts[selected] = (updatedItemCounts[selected] || 0) + 1;
      updatedItemCounts[unSelected] = Math.max(0, (updatedItemCounts[unSelected] || 0) - 1);
      return { ...prevState, countOfSelectedItems: updatedItemCounts };
    });
  }, []);

  /**
   * Main function that handles when a user makes a choice between two items
   * 1. Updates the choice in the grid
   * 2. Updates the count of selected items
   * 3. Recalculates rankings and updates the result list
   */
  const handleChoiceGridChange = useCallback((firstOption: number, secondOption: number, selected: number) => {
    const currentVal = getChosenValue(firstOption, secondOption);
    
    // Handle three cases:
    // 1. User unselects a choice (sets it back to 0)
    // 2. User makes a new choice
    // 3. User changes an existing choice
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

    // Update the rankings and result list based on new counts
    setState(prevState => {
      const itemNumbersInRankedOrder = convertToItemNumbersInRankedOrder(prevState.countOfSelectedItems);
      const updatedListOfResults = updateResultList(prevState.listOfItems, itemNumbersInRankedOrder);
      
      return {
        ...prevState,
        rankingOfItems: itemNumbersInRankedOrder,
        listOfResultItems: updatedListOfResults
      };
    });
  }, [getChosenValue, setChosenValue, updateCountOfSelectedItems]);

  // ===== FILE OPERATIONS =====
  /**
   * Imports a saved prioritization grid from a JSON file
   * Resets the counts and recalculates rankings
   */
  const handleImport = useCallback((jsonData: Partial<PrioritizationState>) => {
    setState(prevState => {
      let listOfItems: string[] = [];
      if (jsonData.listOfItems) {
        // Always ensure length 11, with '' at index 0
        listOfItems = ['', ...jsonData.listOfItems.slice(0, 10)];
        while (listOfItems.length < 11) listOfItems.push('');
      } else {
        listOfItems = Array(11).fill('');
      }
      return {
        ...prevState,
        listOfItems,
        largestEditedItemIndex: jsonData.largestEditedItemIndex || 0,
        choiceGrid: jsonData.choiceGrid || {},
        prioritiesTitle: jsonData.prioritiesTitle || '',
        countOfSelectedItems: Array(11).fill(0)
      };
    });
  }, []);

  /**
   * Exports the current prioritization grid to a JSON file
   * Removes the empty string at index 0 before exporting
   */
  const handleExport = useCallback(() => {
    const shiftedListOfItems = [...state.listOfItems];
    shiftedListOfItems.shift(); // Remove empty string at index 0
    
    const data = {
      choiceGrid: state.choiceGrid,
      listOfItems: shiftedListOfItems,
      largestEditedItemIndex: state.largestEditedItemIndex,
      prioritiesTitle: state.prioritiesTitle
    };
    
    const dataUri = createDataUri(data);
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