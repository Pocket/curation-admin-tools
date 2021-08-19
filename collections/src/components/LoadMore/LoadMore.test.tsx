import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { LoadMore } from './LoadMore';
import userEvent from '@testing-library/user-event';

describe('The LoadMore component', () => {
  let buttonDisabled: boolean;
  let loadMore: () => void;
  let showSpinner: boolean;

  beforeEach(() => {
    buttonDisabled = false;
    loadMore = jest.fn();
    showSpinner = false;
  });

  it('renders with props', () => {
    render(
      <LoadMore
        buttonDisabled={buttonDisabled}
        loadMore={loadMore}
        showSpinner={showSpinner}
      />
    );

    expect(screen.getByText(/load more results/i)).toBeInTheDocument();
  });

  it('disables button if requested', () => {
    buttonDisabled = true;

    render(
      <LoadMore
        buttonDisabled={buttonDisabled}
        loadMore={loadMore}
        showSpinner={showSpinner}
      />
    );

    const button = screen.getByRole('button') as HTMLButtonElement;

    // Helpfully, Material-UI doesn't actually use the 'disabled' attribute
    // on a button element - instead, it adds a couple of 'disabled' classes to it.
    expect(button.getAttribute('class')).toContain('disabled');
  });

  it('shows the loading spinner if requested', () => {
    showSpinner = true;

    render(
      <LoadMore
        buttonDisabled={buttonDisabled}
        loadMore={loadMore}
        showSpinner={showSpinner}
      />
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('calls the "loadMore" button on click', async () => {
    render(
      <LoadMore
        buttonDisabled={buttonDisabled}
        loadMore={loadMore}
        showSpinner={showSpinner}
      />
    );

    const button = screen.getByRole('button') as HTMLButtonElement;

    await waitFor(() => {
      userEvent.click(button);
    });

    expect(loadMore).toHaveBeenCalled();
  });
});
