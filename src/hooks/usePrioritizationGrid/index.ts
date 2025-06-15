import { useState } from 'react';
import { PrioritizationState } from '../../types/prioritization';
import { INITIAL_STATE } from './constants';
import { useTitleHandlers } from './handlers/titleHandlers';
import { useItemHandlers } from './handlers/itemHandlers';
import { useChoiceHandlers } from './handlers/choiceHandlers';
import { useFileHandlers } from './handlers/fileHandlers';

/**
 * Custom hook that manages the state and logic for the prioritization grid
 * Returns the current state and functions to modify it
 */
export const usePrioritizationGrid = () => {
  const [state, setState] = useState<PrioritizationState>(INITIAL_STATE);

  const { handlePrioritiesTitleChange } = useTitleHandlers(setState);
  const { handleItemListChange } = useItemHandlers(setState);
  const { handleChoiceGridChange } = useChoiceHandlers(state, setState);
  const { handleImport, handleExport } = useFileHandlers(state, setState);

  return {
    state,
    handlePrioritiesTitleChange,
    handleItemListChange,
    handleChoiceGridChange,
    handleImport,
    handleExport
  };
}; 