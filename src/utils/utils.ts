export type HashTable<T> = {[key: string]: T};

const DEFAULT_MAX_ITEMS = 10;
const MIN_MAX_ITEMS = 2;
const MAX_MAX_ITEMS = 25;

/** Parse the `items` URL query param; returns a number between MIN and MAX, default DEFAULT_MAX_ITEMS. Pass search to test without touching window. */
export function getMaxItemsFromSearchParams(search?: string): number {
  const query = search !== undefined ? search : (typeof window !== 'undefined' ? window.location.search : '');
  const params = new URLSearchParams(query.startsWith('?') ? query : `?${query}`);
  const raw = params.get('items');
  if (raw == null || raw === '') return DEFAULT_MAX_ITEMS;
  const n = parseInt(raw, 10);
  if (Number.isNaN(n)) return DEFAULT_MAX_ITEMS;
  return Math.min(MAX_MAX_ITEMS, Math.max(MIN_MAX_ITEMS, n));
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