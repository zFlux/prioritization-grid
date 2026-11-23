import { convertToItemNumbersInRankedOrder, type HashTable } from './utils';

export const SAVE_FILE_VERSION = 1;

/** The parts of the grid's state that get saved. `listOfItems` is 1-indexed (index 0 unused). */
export interface GridSnapshot {
  listOfItems: string[];
  choiceGrid: HashTable<HashTable<number>>;
  largestEditedItemIndex: number;
  prioritiesTitle: string;
}

export type LoadResult =
  | { ok: true; snapshot: GridSnapshot; fileItemCount: number; droppedItemCount: number }
  | { ok: false; error: string };

export const LOAD_ERROR_MESSAGE =
  "That file couldn't be loaded. It doesn't look like a saved prioritization grid.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Copy only the decided pairs (non-zero choices) so saved files stay small and tidy. */
function pruneChoiceGrid(choiceGrid: HashTable<HashTable<number>>): HashTable<HashTable<number>> {
  const pruned: HashTable<HashTable<number>> = {};
  for (const [first, row] of Object.entries(choiceGrid)) {
    for (const [second, chosen] of Object.entries(row ?? {})) {
      if (chosen) (pruned[first] ??= {})[second] = chosen;
    }
  }
  return pruned;
}

export function serializeGrid(snapshot: GridSnapshot): string {
  return JSON.stringify(
    {
      version: SAVE_FILE_VERSION,
      listOfItems: snapshot.listOfItems.slice(1),
      choiceGrid: pruneChoiceGrid(snapshot.choiceGrid),
      largestEditedItemIndex: snapshot.largestEditedItemIndex,
      prioritiesTitle: snapshot.prioritiesTitle,
    },
    null,
    2,
  );
}

/**
 * Parse a saved file and fit it to a grid of `maxItems` slots. Items beyond
 * `maxItems` (and any choices involving them) are dropped and reported via
 * `droppedItemCount`; malformed choices are ignored. Also reads files written
 * before `version` existed.
 */
export function parseSavedGrid(text: string, maxItems: number): LoadResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: LOAD_ERROR_MESSAGE };
  }
  if (!isRecord(raw) || !Array.isArray(raw.listOfItems)) {
    return { ok: false, error: LOAD_ERROR_MESSAGE };
  }

  const fileItems = raw.listOfItems.map((v) => (typeof v === 'string' ? v : v == null ? '' : String(v)));
  let fileItemCount = fileItems.length;
  while (fileItemCount > 0 && fileItems[fileItemCount - 1].trim() === '') fileItemCount--;
  const droppedItemCount = Math.max(0, fileItemCount - maxItems);

  const listOfItems = ['', ...Array.from({ length: maxItems }, (_, i) => fileItems[i] ?? '')];

  const isSlot = (n: number) => Number.isInteger(n) && n >= 1 && n <= maxItems;
  const choiceGrid: HashTable<HashTable<number>> = {};
  if (isRecord(raw.choiceGrid)) {
    for (const [firstKey, row] of Object.entries(raw.choiceGrid)) {
      const first = Number(firstKey);
      if (!isSlot(first) || !isRecord(row)) continue;
      for (const [secondKey, chosen] of Object.entries(row)) {
        const second = Number(secondKey);
        if (!isSlot(second) || second <= first) continue;
        if (chosen === first || chosen === second) (choiceGrid[first] ??= {})[second] = chosen;
      }
    }
  }

  const savedLargest = Number(raw.largestEditedItemIndex);
  const largestEditedItemIndex = Math.min(
    maxItems,
    Math.max(Number.isInteger(savedLargest) ? savedLargest : 0, Math.min(fileItemCount, maxItems)),
  );

  return {
    ok: true,
    fileItemCount,
    droppedItemCount,
    snapshot: {
      listOfItems,
      choiceGrid,
      largestEditedItemIndex,
      prioritiesTitle: typeof raw.prioritiesTitle === 'string' ? raw.prioritiesTitle : '',
    },
  };
}

/** Recompute counts, ranking and the prioritized list from a set of choices. */
export function deriveResults(listOfItems: string[], choiceGrid: HashTable<HashTable<number>>, maxItems: number) {
  const countOfSelectedItems = Array<number>(maxItems + 1).fill(0);
  for (const row of Object.values(choiceGrid)) {
    for (const chosen of Object.values(row ?? {})) {
      if (chosen > 0 && chosen <= maxItems) countOfSelectedItems[chosen]++;
    }
  }
  const rankingOfItems = convertToItemNumbersInRankedOrder(countOfSelectedItems);
  const listOfResultItems = [...listOfItems];
  for (let i = 1; i < listOfItems.length; i++) {
    if (rankingOfItems[i]) listOfResultItems[i] = listOfItems[rankingOfItems[i]];
  }
  return { countOfSelectedItems, rankingOfItems, listOfResultItems };
}

export function defaultFileName(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `priorities-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.json`;
}

/** Read a File as text. Uses FileReader rather than File.text() for wider support. */
export function readFileAsText(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function downloadTextFile(fileName: string, text: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
