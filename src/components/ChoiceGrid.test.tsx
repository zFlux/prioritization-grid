import { render, screen } from '@testing-library/react';
import ChoiceGrid from './ChoiceGrid';
import { act } from 'react-dom/test-utils';

const mockChange = jest.fn();

describe('Rendering a ChoiceGrid', () => {

  let choiceGrid: HTMLElement;
  let secondOptions: HTMLElement[];
  let tenthOptions: HTMLElement[];

  const renderChoiceGrid = () => {
    mockChange.mockClear();
    render(<ChoiceGrid gridSize={10} onChange={mockChange}/>);
    choiceGrid = screen.getByTestId(/choice-grid-id/i);
    secondOptions = screen.getAllByText(/2/i);
    tenthOptions = screen.getAllByText(/10/i);
  }

  test('choice grid is rendered', () => {
    renderChoiceGrid();
    expect(choiceGrid).toBeInTheDocument();
  });

  test('there are 9 options with the number 10', () => {
    renderChoiceGrid();
    expect(tenthOptions.length).toBe(9);
  });

  test('there are 9 options with the number 2', () => {
    renderChoiceGrid();
    expect(secondOptions.length).toBe(9);
  });

  test('clicking an option on the grid calls the onChange event', () => {
    renderChoiceGrid();
    act(() => {
      secondOptions[0].click();
    });
    expect(mockChange).toHaveBeenCalledWith(2, 0);
  });

});

export {};