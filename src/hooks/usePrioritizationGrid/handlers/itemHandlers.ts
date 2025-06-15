import { useCallback } from 'react';
import { PrioritizationState } from '../../../types/prioritization';

export const useItemHandlers = (setState: React.Dispatch<React.SetStateAction<PrioritizationState>>) => {
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
  }, [setState]);

  return {
    handleItemListChange
  };
}; 