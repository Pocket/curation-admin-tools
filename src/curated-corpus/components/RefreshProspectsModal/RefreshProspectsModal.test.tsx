import React from 'react';
import { render, screen } from '@testing-library/react';
import { RefreshProspectsModal } from './RefreshProspectsModal';
import userEvent from '@testing-library/user-event';

describe('The RefreshProspectsModal component', () => {
  it('should render heading and copy when open', () => {
    render(
      <RefreshProspectsModal
        isOpen={true}
        onConfirm={jest.fn()}
        toggleModal={jest.fn()}
      />
    );

    expect(screen.getByText(/refresh prospects/i)).toBeInTheDocument();
    expect(
      screen.getByText(/there are still some prospects remaining on the page/i)
    ).toBeInTheDocument();
  });

  it('should render the "Confirm" and "Cancel" buttons', () => {
    render(
      <RefreshProspectsModal
        isOpen={true}
        onConfirm={jest.fn()}
        toggleModal={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should run an action on pressing the "Confirm" button', () => {
    const onConfirm = jest.fn();

    render(
      <RefreshProspectsModal
        isOpen={true}
        onConfirm={onConfirm}
        toggleModal={jest.fn()}
      />
    );

    userEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(onConfirm).toHaveBeenCalled();
  });

  it('should run an action on pressing the "Cancel" button', () => {
    const toggleModal = jest.fn();

    render(
      <RefreshProspectsModal
        isOpen={true}
        onConfirm={jest.fn()}
        toggleModal={toggleModal}
      />
    );

    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(toggleModal).toHaveBeenCalled();
  });
});
