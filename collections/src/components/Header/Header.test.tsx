import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('The Header component', () => {
  it('renders successfully', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // There are two logos: one for desktop, one for mobile
    const logos = screen.getAllByRole('img');

    logos.forEach((logo) => {
      expect(logo).toBeInTheDocument();
    });
  });
});
