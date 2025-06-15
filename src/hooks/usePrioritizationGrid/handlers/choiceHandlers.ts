import { useCallback } from 'react';
import { PrioritizationState } from '../../../types/prioritization';
import { convertToItemNumbersInRankedOrder } from '../../../utils/utils';
import { updateResultList } from '../utils';

export const useChoiceHandlers = (
  state: PrioritizationState,
  setState: React.Dispatch<React.SetStateAction<PrioritizationState>>
) => {
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
  }, [setState]);

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
  }, [setState]);

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
  }, [getChosenValue, setChosenValue, updateCountOfSelectedItems, setState]);

  return {
    handleChoiceGridChange
  };
}; 