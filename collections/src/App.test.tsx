import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders "Curation Tools" heading"', () => {
  render(<App />);
  const testCopy = screen.getByText(/curation tools/i);
  expect(testCopy).toBeInTheDocument();
});
