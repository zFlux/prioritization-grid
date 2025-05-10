export interface ChoiceGridData {
  [key: number]: {
    [key: number]: number;
  };
}

export interface PrioritizationState {
  countOfSelectedItems: number[];
  listOfItems: string[];
  listOfResultItems: string[];
  rankingOfItems: number[];
  choiceGrid: ChoiceGridData;
  largestEditedItemIndex: number;
  prioritiesTitle: string;
}

export enum ChoiceValue {
  NONE = 0,
  FIRST = 1,
  SECOND = 2
} 