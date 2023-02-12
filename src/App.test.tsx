import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders priority grid', () => {
  render(<App />);
  const priorityGridElement = screen.getByTestId(/prioritization-grid-id/i);
  expect(priorityGridElement).toBeInTheDocument();
});
