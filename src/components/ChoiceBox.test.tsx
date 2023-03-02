import { render, screen } from '@testing-library/react';
import ChoiceBox from './ChoiceBox';
import { act } from 'react-dom/test-utils';

const mockChange = jest.fn();

describe('Rendering a ChoiceBox', () => {

  let firstChoice: HTMLElement;
  let secondChoice: HTMLElement;

  const renderChoiceBox = () => {
    mockChange.mockClear();
    render(<ChoiceBox firstOption={1} secondOption={2} selectable={true} selected={0} onChange={mockChange} />);
    firstChoice = screen.getByText(/1/i);
    secondChoice = screen.getByText(/2/i);
  }

  test('renders first value', () => {
    renderChoiceBox();
    expect(firstChoice).toBeInTheDocument();
  });

  test('renders second value', () => {
    renderChoiceBox();
    expect(secondChoice).toBeInTheDocument();
  });

  test('first option is not selected', () => {
    renderChoiceBox();
    expect(firstChoice).toHaveClass('Choice');
  });

  test('second option is not selected', () => {
    renderChoiceBox();
    expect(secondChoice).toHaveClass('Choice');
  });
});

describe('When a choice is clicked', () => {

  let firstChoice: HTMLElement;

  const clickFirstChoice = () => {
    mockChange.mockClear();
    render(<ChoiceBox firstOption={1} secondOption={2} selectable={true} selected={1} onChange={mockChange} />);
    firstChoice = screen.getByText(/1/i);
    act(() => {
      firstChoice.click();
    });
  }

  test('clicked choice is selected', () => {
    clickFirstChoice();
    expect(firstChoice).toHaveClass('ChoiceSelected');
  });

  test('onChange event is called', () => {
    clickFirstChoice();
    expect(mockChange).toHaveBeenCalledWith(1, 0);
  });
});

describe('When a choice is double clicked', () => {

  let firstChoice: HTMLElement;

  const doubleClickFirstChoice = () => {
    mockChange.mockClear();
    render(<ChoiceBox firstOption={1} secondOption={2} selectable={true} selected={1} onChange={mockChange} />);
    firstChoice = screen.getByText(/1/i);
    act(() => { firstChoice.click(); });
    act(() => { firstChoice.click(); });
  }

  test('double clicked choice is unselected', () => {
    doubleClickFirstChoice();
    expect(firstChoice).toHaveClass('Choice');
  });

  test('onChange event is called twice with expected selected / unselected values', () => {
    doubleClickFirstChoice();
    expect(mockChange).toHaveBeenCalledWith(1, 0);
    expect(mockChange).toHaveBeenCalledWith(0, 1);
  });
});

describe('When two different choices are clicked in sequence', () => {

  let firstChoice: HTMLElement;
  let secondChoice: HTMLElement;

  const clickFirstThenSecondChoice = () => {
    mockChange.mockClear();
    render(<ChoiceBox firstOption={1} secondOption={2} selectable={true} selected={2} onChange={mockChange} />);
    firstChoice = screen.getByText(/1/i);
    secondChoice = screen.getByText(/2/i);
    act(() => { firstChoice.click(); });
    act(() => { secondChoice.click(); });
  }

  test('choice clicked first is unselected', () => {
    clickFirstThenSecondChoice();
    expect(firstChoice).toHaveClass('Choice');
  });

  test('choice clicked second is selected', () => {
    clickFirstThenSecondChoice();
    expect(secondChoice).toHaveClass('ChoiceSelected');
  });

  test('onChange event is called twice with expected selected / unselected values', () => {
    clickFirstThenSecondChoice();
    expect(mockChange).toHaveBeenCalledWith(1, 0);
    expect(mockChange).toHaveBeenCalledWith(2, 1);
  });
});

export {};