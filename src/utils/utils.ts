export type HashTable<T> = {[key: string]: T};

export const DEFAULT_MAX_ITEMS = 10;
/** Fewest slots the grid offers. With 2 items there is a single comparison, so a grid adds nothing. */
export const MIN_MAX_ITEMS = 3;
export const MAX_MAX_ITEMS = 25;

/** Clamp any requested item count to MIN..MAX; non-numbers fall back to the default. */
export function clampItemCount(value: unknown): number {
  const n = typeof value === 'number' ? Math.floor(value) : parseInt(String(value), 10);
  if (!Number.isFinite(n)) return DEFAULT_MAX_ITEMS;
  return Math.min(MAX_MAX_ITEMS, Math.max(MIN_MAX_ITEMS, n));
}

/** Parse the `items` URL query param; returns a number between MIN and MAX, default DEFAULT_MAX_ITEMS. Pass search to test without touching window. */
export function getMaxItemsFromSearchParams(search?: string): number {
  const query = search !== undefined ? search : (typeof window !== 'undefined' ? window.location.search : '');
  const params = new URLSearchParams(query.startsWith('?') ? query : `?${query}`);
  const raw = params.get('items');
  if (raw == null || raw === '') return DEFAULT_MAX_ITEMS;
  return clampItemCount(raw);
}

export function replaceAt<T>(list: T[], index: number, value: T): T[] {
  return [...list.slice(0, index), value, ...list.slice(index+1)];
}

export function convertToItemNumbersInRankedOrder(countOfSelectedItems: number[]): number[] {
  let rankLists: number[][] = [[]];
  for (let itemNumber = 1; itemNumber < countOfSelectedItems.length; itemNumber++) {
    let rank = countOfSelectedItems[itemNumber];
    if(!rankLists[rank]) rankLists[rank] = [];
    rankLists[rank].push(itemNumber);
  }
  let itemNumbersInRankedOrder: number[] = rankLists.reverse().flat();
  itemNumbersInRankedOrder.unshift(0);
  return itemNumbersInRankedOrder;
}