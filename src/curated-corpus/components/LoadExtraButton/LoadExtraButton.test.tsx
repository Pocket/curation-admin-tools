import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoadExtraButton } from './LoadExtraButton';
import userEvent from '@testing-library/user-event';

describe('The LoadExtraButton component', () => {
  it('renders with props', () => {
    render(
      <MemoryRouter>
        <LoadExtraButton
          arrowDirection="up"
          onClick={jest.fn()}
          label="More results"
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/more results/i)).toBeInTheDocument();
  });

  it('calls the "onClick" method on click', async () => {
    const onClick = jest.fn();
    render(
      <MemoryRouter>
        <LoadExtraButton
          arrowDirection="up"
          onClick={onClick}
          label="More results"
        />
      </MemoryRouter>
    );

    const button = screen.getByRole('button') as HTMLButtonElement;

    await waitFor(() => {
      userEvent.click(button);
    });

    expect(onClick).toHaveBeenCalled();
  });
});
