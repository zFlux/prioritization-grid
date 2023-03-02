export type HashTable<T> = {[key: string]: T};

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