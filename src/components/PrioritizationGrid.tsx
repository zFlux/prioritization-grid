import React from 'react';
import ChoiceGrid from './ChoiceGrid';
import ResultGrid from './ResultGrid';
import ItemGrid from './ItemGrid';
import { usePrioritizationGrid } from '../hooks/usePrioritizationGrid';
import './PrioritizationGrid.scss';

const PrioritizationGrid: React.FC = () => {
  const {
    state,
    handlePrioritiesTitleChange,
    handleItemListChange,
    handleChoiceGridChange,
    handleImport,
    handleExport
  } = usePrioritizationGrid();

  return (
    <div className='PrioritizationGrid' data-testid='prioritization-grid-id'>
      <div className='PrioritizationGridHeader'>
        <div className='ImportExportButtons'>
          <label className='ImportButton' htmlFor="inputTag">
            Load From File
            <input 
              id="inputTag" 
              type="file" 
              accept=".json" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const jsonData = JSON.parse(event.target?.result?.toString() || '');
                    handleImport(jsonData);
                  };
                  reader.readAsText(file);
                }
              }} 
            />
          </label>
          <button 
            className='ExportButton' 
            onClick={handleExport}
          >
            Export to File
          </button>
        </div>
      </div>
      <textarea
        className='PrioritiesTitle'
        autoFocus
        onChange={handlePrioritiesTitleChange}
        value={state.prioritiesTitle}
        placeholder='Input what you are prioritizing'
      />
      <div className='ItemGridAndChoiceGridContainer'>
        <ItemGrid
          itemList={state.listOfItems}
          largestEditedItemIndex={state.largestEditedItemIndex}
          resultList={state.listOfResultItems}
          onChange={handleItemListChange}
        />
        <ChoiceGrid
          gridSize={10}
          choiceGridData={state.choiceGrid}
          largestEditedItemIndex={state.largestEditedItemIndex}
          onChange={handleChoiceGridChange}
        />
      </div>
      <ResultGrid
        countOfSelectedItems={state.countOfSelectedItems}
        rankingsOfItems={state.rankingOfItems}
      />
    </div>
  );
};

export default PrioritizationGrid;   