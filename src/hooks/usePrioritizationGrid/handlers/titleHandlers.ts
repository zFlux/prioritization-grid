import { useCallback } from 'react';
import { PrioritizationState } from '../../../types/prioritization';

export const useTitleHandlers = (setState: React.Dispatch<React.SetStateAction<PrioritizationState>>) => {
  /**
   * Updates the title of the prioritization exercise
   * Called when user types in the title textarea
   */
  const handlePrioritiesTitleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState(prevState => ({
      ...prevState,
      prioritiesTitle: event?.currentTarget?.value
    }));
  }, [setState]);

  return {
    handlePrioritiesTitleChange
  };
}; 