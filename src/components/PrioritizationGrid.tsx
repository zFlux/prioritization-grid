import React, { type ChangeEvent } from 'react';
import ChoiceGrid from './ChoiceGrid';
import ResultGrid from './ResultGrid';
import { replaceAt, convertToItemNumbersInRankedOrder, clampItemCount, type HashTable } from '../utils/utils';
import { parseSavedGrid, serializeGrid, deriveResults, defaultFileName, downloadTextFile, readFileAsText, LOAD_ERROR_MESSAGE } from '../utils/saveFile';
import './PrioritizationGrid.scss';
import ItemGrid from './ItemGrid';
import FileActions, { type FileMessage } from './FileActions';

function createInitialArrays(maxItems: number) {
  const length = maxItems + 1;
  return {
    countOfSelectedItems: Array<number>(length).fill(0),
    listOfResultItems: Array<string>(length).fill(''),
    listOfItems: Array<string>(length).fill(''),
    rankingOfItems: Array<number>(length).fill(0),
  };
}

interface PrioritizationGridProps {
  /** Requested number of slots; clamped to MIN_MAX_ITEMS..MAX_MAX_ITEMS (3..25). */
  maxItems: number;
}

interface PrioritizationGridState {
    countOfSelectedItems: number[];
    listOfItems: string[];
    listOfResultItems: string[];
    rankingOfItems: number[];
    choiceGrid: HashTable<HashTable<number>>;
    largestEditedItemIndex: number;
    prioritiesTitle: string;
    fileMessage: FileMessage | null;
    isDraggingFile: boolean;
}

export default class PrioritizationGrid extends React.Component<PrioritizationGridProps,PrioritizationGridState> {

    focusRef = React.createRef<HTMLTextAreaElement>();
    messageTimer: ReturnType<typeof setTimeout> | null = null;

    /** The item count actually used, whatever the host passes in. */
    get maxItems(): number {
        return clampItemCount(this.props.maxItems);
    }

    componentDidMount() {
      this.focusRef.current?.focus();
      window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
      window.removeEventListener('keydown', this.handleKeyDown);
      if (this.messageTimer) clearTimeout(this.messageTimer);
    }

    constructor(props: PrioritizationGridProps) {
        super(props);
        const initial = createInitialArrays(clampItemCount(props.maxItems));
        this.state = {
            countOfSelectedItems: initial.countOfSelectedItems,
            listOfItems: initial.listOfItems,
            listOfResultItems: initial.listOfResultItems,
            rankingOfItems: initial.rankingOfItems,
            choiceGrid: {},
            largestEditedItemIndex: 0,
            prioritiesTitle: '',
            fileMessage: null,
            isDraggingFile: false
        }
        this.itemListChange = this.itemListChange.bind(this);
        this.choiceGridChange = this.choiceGridChange.bind(this);
        this.saveToFile = this.saveToFile.bind(this);
        this.loadFromFile = this.loadFromFile.bind(this);
        this.setChosenValue = this.setChosenValue.bind(this);
        this.getChosenValue = this.getChosenValue.bind(this);
        this.handlePrioritiesTitleChange = this.handlePrioritiesTitleChange.bind(this);
    }

    handlePrioritiesTitleChange(event: ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ prioritiesTitle: event.currentTarget.value });
    }

    setChosenValue(choiceOne: number, choiceTwo: number, chosen: number) {
        const choiceGrid = this.state.choiceGrid;
        if (!choiceGrid[choiceOne]) {
          choiceGrid[choiceOne] = {};
        }
        choiceGrid[choiceOne][choiceTwo] = chosen;
        this.setState({ choiceGrid: choiceGrid });
      }
      
    getChosenValue(choiceOne: number, choiceTwo: number): number {
        const choiceGrid = this.state.choiceGrid;
        if (choiceGrid[choiceOne] && choiceGrid[choiceOne][choiceTwo] !== undefined) {
          return choiceGrid[choiceOne][choiceTwo];
        }
        return 0;
      }

    itemListChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const index = Number.parseInt(event.currentTarget.id.split('_')[1]);
        const newItem = event.currentTarget.value;
        const updatedListOfItems = replaceAt(this.state.listOfItems, index, newItem);
        this.setState({ listOfItems: updatedListOfItems });
        let largestEditedItemIndex = Math.max(this.state.largestEditedItemIndex, index);
        this.setState({ largestEditedItemIndex: largestEditedItemIndex });
    }

    choiceGridChange(firstOption: number, secondOption: number, selected: number) { 
        const currentVal = this.getChosenValue(firstOption, secondOption);
        if (currentVal === selected) {
            this.setChosenValue(firstOption, secondOption, 0);
            this.updateCountOfSelectedItems(0, selected);
        }  else if (currentVal === 0) {
            this.setChosenValue(firstOption, secondOption, selected);
            this.updateCountOfSelectedItems(selected, 0);
        } else {
            this.setChosenValue(firstOption, secondOption, selected);
            this.updateCountOfSelectedItems(selected, currentVal);
        }

        const updatedItemRankings = this.updateItemRankings();
        this.updateListOfResultItems(updatedItemRankings);
    }

    updateCountOfSelectedItems(selected: number, unSelected: number) {
        let updatedItemCounts = this.state.countOfSelectedItems;
        updatedItemCounts[selected] ? updatedItemCounts[selected]++ : updatedItemCounts[selected] = 1;
        updatedItemCounts[unSelected] ? updatedItemCounts[unSelected]-- : updatedItemCounts[unSelected] = 0;
        this.setState({ countOfSelectedItems: updatedItemCounts });
    }

    updateItemRankings() {
        const itemNumbersInRankedOrder = 
            convertToItemNumbersInRankedOrder(this.state.countOfSelectedItems);
        this.setState({rankingOfItems: itemNumbersInRankedOrder});
        return itemNumbersInRankedOrder;
    }

    updateListOfResultItems(updatedItemRankings: number[]) {
        let updatedListOfResults= [...this.state.listOfItems];
        for (let i = 1; i < this.state.listOfItems.length; i++) {
            if (updatedItemRankings[i]) updatedListOfResults[i] = this.state.listOfItems[updatedItemRankings[i]];
        }
        this.setState({listOfResultItems: updatedListOfResults});
    }

    hasItems(): boolean {
        return this.state.listOfItems.some((item) => item.trim() !== '');
    }

    showFileMessage(message: FileMessage) {
        if (this.messageTimer) clearTimeout(this.messageTimer);
        this.setState({ fileMessage: message });
        this.messageTimer = setTimeout(
            () => this.setState({ fileMessage: null }),
            message.kind === 'error' ? 10000 : 5000,
        );
    }

    saveToFile() {
        if (!this.hasItems()) return;
        const fileName = defaultFileName();
        downloadTextFile(fileName, serializeGrid(this.state));
        this.showFileMessage({ kind: 'info', text: `Saved ${fileName}` });
    }

    async loadFromFile(file: File) {
        let text: string;
        try {
            text = await readFileAsText(file);
        } catch {
            this.showFileMessage({ kind: 'error', text: LOAD_ERROR_MESSAGE });
            return;
        }
        const { maxItems } = this;
        const result = parseSavedGrid(text, maxItems);
        if (!result.ok) {
            this.showFileMessage({ kind: 'error', text: result.error });
            return;
        }
        const { snapshot, fileItemCount, droppedItemCount } = result;
        this.setState({
            ...snapshot,
            ...deriveResults(snapshot.listOfItems, snapshot.choiceGrid, maxItems),
        });
        if (droppedItemCount > 0) {
            const firstDropped = maxItems + 1;
            const dropped = firstDropped === fileItemCount ? `item ${firstDropped} was` : `items ${firstDropped}–${fileItemCount} were`;
            this.showFileMessage({
                kind: 'error',
                text: `Loaded ${file.name}, but it has ${fileItemCount} items and this grid fits ${maxItems}, so ${dropped} left out.`,
            });
        } else {
            this.showFileMessage({ kind: 'info', text: `Loaded ${file.name}` });
        }
    }

    handleKeyDown = (event: KeyboardEvent) => {
        const isSaveShortcut = (event.metaKey || event.ctrlKey) && !event.shiftKey && !event.altKey && event.key.toLowerCase() === 's';
        // Only take over the browser's "Save page" when there is something to save.
        if (isSaveShortcut && this.hasItems()) {
            event.preventDefault();
            this.saveToFile();
        }
    }

    static isFileDrag(event: React.DragEvent) {
        return Array.from(event.dataTransfer?.types ?? []).includes('Files');
    }

    handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        if (!PrioritizationGrid.isFileDrag(event)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        if (!this.state.isDraggingFile) this.setState({ isDraggingFile: true });
    }

    handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        const next = event.relatedTarget as Node | null;
        if (!next || !event.currentTarget.contains(next)) this.setState({ isDraggingFile: false });
    }

    handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        if (!PrioritizationGrid.isFileDrag(event)) return;
        event.preventDefault();
        this.setState({ isDraggingFile: false });
        const file = event.dataTransfer.files?.[0];
        if (file) this.loadFromFile(file);
    }

    render() {
        return (
            <div
                className={'PrioritizationGrid' + (this.state.isDraggingFile ? ' PrioritizationGridDropTarget' : '')}
                data-testid='prioritization-grid-id'
                onDragOver={this.handleDragOver}
                onDragLeave={this.handleDragLeave}
                onDrop={this.handleDrop}
            >
                <div className='ItemGridAndChoiceGridContainer'>
                    <ItemGrid maxItems={this.maxItems} itemList={this.state.listOfItems} largestEditedItemIndex={this.state.largestEditedItemIndex} resultList={this.state.listOfResultItems} onChange={this.itemListChange} />
                    <ChoiceGrid gridSize={this.maxItems} choiceGridData={this.state.choiceGrid} largestEditedItemIndex={this.state.largestEditedItemIndex} onChange={this.choiceGridChange} />
                </div>
                <ResultGrid countOfSelectedItems={this.state.countOfSelectedItems} rankingsOfItems={this.state.rankingOfItems} />
                <FileActions
                    canSave={this.hasItems()}
                    onSave={this.saveToFile}
                    onLoadFile={this.loadFromFile}
                    message={this.state.fileMessage}
                />
            </div>
        );
    }
}   