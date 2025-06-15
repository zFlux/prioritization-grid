import { PrioritizationState } from '../../types/prioritization';

// ===== CONSTANTS =====
export const GRID_SIZE = 11; // We use arrays of length 11 because we want indices 1-10 for items (index 0 is unused)

// ===== INITIAL STATE VALUES =====
export const INITIAL_COUNT_OF_SELECTED_ITEMS = Array(GRID_SIZE).fill(0);
export const INITIAL_LIST_OF_RESULT_ITEMS = Array(GRID_SIZE).fill('');
export const INITIAL_LIST_OF_ITEMS = Array(GRID_SIZE).fill('');
export const INITIAL_RANKING_OF_ITEMS = Array(GRID_SIZE).fill(0);

export const INITIAL_STATE: PrioritizationState = {
  countOfSelectedItems: INITIAL_COUNT_OF_SELECTED_ITEMS,
  listOfItems: INITIAL_LIST_OF_ITEMS,
  listOfResultItems: INITIAL_LIST_OF_RESULT_ITEMS,
  rankingOfItems: INITIAL_RANKING_OF_ITEMS,
  choiceGrid: {},
  largestEditedItemIndex: 0,
  prioritiesTitle: ''
}; 