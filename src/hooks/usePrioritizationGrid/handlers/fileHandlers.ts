import { useCallback } from 'react';
import { PrioritizationState } from '../../../types/prioritization';
import { createDataUri } from '../utils';
import { INITIAL_COUNT_OF_SELECTED_ITEMS } from '../constants';

export const useFileHandlers = (
  state: PrioritizationState,
  setState: React.Dispatch<React.SetStateAction<PrioritizationState>>
) => {
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
        countOfSelectedItems: INITIAL_COUNT_OF_SELECTED_ITEMS
      };
    });
  }, [setState]);

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
    handleImport,
    handleExport
  };
}; 