import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders "Hello World" heading"', () => {
  render(<App />);
  const testCopy = screen.getByText(/hello world/i);
  expect(testCopy).toBeInTheDocument();
});
