import { render, screen } from '@testing-library/react';
import ChoiceBox from './ChoiceBox';
import { act } from 'react-dom/test-utils';

  // create a mock function to pass to the onChange event
  const mockChange = jest.fn();

describe('Rendering a ChoiceBox', () => {
  test('renders first option', () => {
    render(<ChoiceBox firstOption={1} secondOption={2} onChange={mockChange} />);
    const choiceBox = screen.getByText(/1/i);
    expect(choiceBox).toBeInTheDocument();
  });

  test('renders second option', () => {
    render(<ChoiceBox firstOption={1} secondOption={2} onChange={mockChange} />);
    const choiceBox = screen.getByText(/2/i);
    expect(choiceBox).toBeInTheDocument();
  });

  test('first option is not selected', () => {
    render(<ChoiceBox firstOption={1} secondOption={2} onChange={mockChange} />);
    const choiceBox = screen.getByText(/1/i);
    expect(choiceBox).toHaveClass('Choice');
  });

  test('second option is not selected', () => {
    render(<ChoiceBox firstOption={1} secondOption={2} onChange={mockChange} />);
    const choiceBox = screen.getByText(/2/i);
    expect(choiceBox).toHaveClass('Choice');
  });
});

test('a choice is selected when clicked', () => {
  render(<ChoiceBox firstOption={1} secondOption={2} onChange={mockChange} />);
  const firstChoiceBox = screen.getByText(/1/i);
  const secondChoiceBox = screen.getByText(/2/i);

  expect(firstChoiceBox).toBeInTheDocument();
  expect(secondChoiceBox).toBeInTheDocument();

  act(() => {
    firstChoiceBox.click();
  });
  expect(firstChoiceBox).toHaveClass('ChoiceSelected');
  expect(secondChoiceBox).toHaveClass('Choice');
});

test('onChange event is called when a choice is selected', () => {
  render(<ChoiceBox firstOption={1} secondOption={2} onChange={mockChange} />);
  const firstChoiceBox = screen.getByText(/1/i);
  const secondChoiceBox = screen.getByText(/2/i);

  expect(firstChoiceBox).toBeInTheDocument();
  expect(secondChoiceBox).toBeInTheDocument();

  act(() => {
    firstChoiceBox.click();
  });
  expect(mockChange).toHaveBeenCalledWith(1, 0);
});

export {};