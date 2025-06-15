/**
 * Creates a data URI for downloading JSON data
 */
export const createDataUri = (data: any): string => {
  const jsonData = JSON.stringify(data);
  return `data:text/json;charset=utf-8,${encodeURIComponent(jsonData)}`;
};

/**
 * Updates the result list based on the current rankings
 */
export const updateResultList = (listOfItems: string[], itemNumbersInRankedOrder: number[]): string[] => {
  const updatedListOfResults = Array(listOfItems.length).fill('');
  for (let i = 1; i < listOfItems.length; i++) {
    const rankedIndex = itemNumbersInRankedOrder[i];
    if (rankedIndex && listOfItems[rankedIndex]) {
      updatedListOfResults[i] = listOfItems[rankedIndex];
    }
  }
  return updatedListOfResults;
}; 