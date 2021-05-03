import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders "Latest Draft Collections" heading"', () => {
  render(<App />);
  const testCopy = screen.getByText(/latest draft collections/i);
  expect(testCopy).toBeInTheDocument();
});
