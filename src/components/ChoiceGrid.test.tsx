import { render, screen } from '@testing-library/react';
import ChoiceGrid from './ChoiceGrid';
import { act } from 'react-dom/test-utils';
import { HashTable } from '../utils/utils';

const mockChange = vi.fn();

describe('Rendering a ChoiceGrid', () => {

  let choiceGrid: HTMLElement;
  let secondOptions: HTMLElement[];
  let tenthOptions: HTMLElement[];
  let choiceGridData: HashTable<HashTable<number>> = {};

  const renderChoiceGrid = () => {
    mockChange.mockClear();
    render(<ChoiceGrid choiceGridData={choiceGridData} gridSize={16} onChange={mockChange} largestEditedItemIndex={16}/>);
    choiceGrid = screen.getByTestId(/choice-grid-id/i);
    secondOptions = screen.getAllByText('2');
    tenthOptions = screen.getAllByText('10');
  }

  test('choice grid is rendered', () => {
    renderChoiceGrid();
    expect(choiceGrid).toBeInTheDocument();
  });

  test('there are 15 options with the number 10', () => {
    renderChoiceGrid();
    expect(tenthOptions.length).toBe(15);
  });

  test('there are 15 options with the number 2', () => {
    renderChoiceGrid();
    expect(secondOptions.length).toBe(15);
  });

  test('clicking an option on the grid calls the onChange event', () => {
    renderChoiceGrid();
    const cellWithTwoAndThree = secondOptions.find(
      (el) => el.closest('.ChoiceBox')?.textContent?.includes('3')
    );
    act(() => {
      cellWithTwoAndThree!.click();
    });
    expect(mockChange).toHaveBeenCalledWith(2, 3, 2);
  });

});

export {};