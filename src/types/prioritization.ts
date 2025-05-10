/**
 * A generic type that represents a key-value store where keys are strings
 * Example: { "1": { "2": 1 } } represents choice 1 was selected over choice 2
 */
export interface HashTable<T> {
  [key: string]: T;
}

/**
 * The complete state of our prioritization grid
 * - countOfSelectedItems: Tracks how many times each item was chosen
 * - listOfItems: The actual items being compared (e.g., ["", "Pizza", "Burger", ...])
 * - listOfResultItems: The items in their final ranked order
 * - rankingOfItems: The numerical ranking of each item
 * - choiceGrid: Stores all the pairwise comparisons
 * - largestEditedItemIndex: Tracks the highest index of items that have been edited
 * - prioritiesTitle: The title of this prioritization exercise
 */
export interface PrioritizationState {
  countOfSelectedItems: number[];
  listOfItems: string[];
  listOfResultItems: string[];
  rankingOfItems: number[];
  choiceGrid: HashTable<HashTable<number>>;
  largestEditedItemIndex: number;
  prioritiesTitle: string;
}

export enum ChoiceValue {
  NONE = 0,
  FIRST = 1,
  SECOND = 2
} 