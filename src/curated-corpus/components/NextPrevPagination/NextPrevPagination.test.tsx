import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { NextPrevPagination } from './NextPrevPagination';
import userEvent from '@testing-library/user-event';

describe('The NextPrevPagination component', () => {
  it('renders the Next and Previous buttons', () => {
    render(
      <NextPrevPagination
        hasNextPage={true}
        hasPreviousPage={true}
        loadNext={jest.fn()}
        loadPrevious={jest.fn()}
      />
    );

    const nextButton = screen.getByText(/next page/i);
    expect(nextButton).toBeInTheDocument();

    const prevButton = screen.getByText(/previous page/i);
    expect(prevButton).toBeInTheDocument();
  });

  it('does not render buttons if data cannot be paginated through', () => {
    render(
      <NextPrevPagination
        hasNextPage={false}
        hasPreviousPage={false}
        loadNext={jest.fn()}
        loadPrevious={jest.fn()}
      />
    );

    const nextButton = screen.queryByText(/next page/i);
    expect(nextButton).not.toBeInTheDocument();

    const prevButton = screen.queryByText(/previous page/i);
    expect(prevButton).not.toBeInTheDocument();
  });

  it('shows only "Next Page" if previous data is not available', () => {
    render(
      <NextPrevPagination
        hasNextPage={true}
        hasPreviousPage={false}
        loadNext={jest.fn()}
        loadPrevious={jest.fn()}
      />
    );

    const nextButton = screen.getByText(/next page/i);
    expect(nextButton).toBeInTheDocument();

    const prevButton = screen.queryByText(/previous page/i);
    expect(prevButton).not.toBeInTheDocument();
  });

  it('shows only "Previous Page" if further data is not available', () => {
    render(
      <NextPrevPagination
        hasNextPage={false}
        hasPreviousPage={true}
        loadNext={jest.fn()}
        loadPrevious={jest.fn()}
      />
    );

    const nextButton = screen.queryByText(/next page/i);
    expect(nextButton).not.toBeInTheDocument();

    const prevButton = screen.getByText(/previous page/i);
    expect(prevButton).toBeInTheDocument();
  });

  it('executes the nextPage() function when button is pressed', async () => {
    const loadNext = jest.fn();
    render(
      <NextPrevPagination
        hasNextPage={true}
        hasPreviousPage={true}
        loadNext={loadNext}
        loadPrevious={jest.fn()}
      />
    );

    const button = screen.getByText(/next page/i);

    await waitFor(() => {
      userEvent.click(button);
    });

    expect(loadNext).toHaveBeenCalled();
  });

  it('executes the previousPage() function when button is pressed', async () => {
    const loadPrevious = jest.fn();
    render(
      <NextPrevPagination
        hasNextPage={true}
        hasPreviousPage={true}
        loadNext={jest.fn()}
        loadPrevious={loadPrevious}
      />
    );

    const button = screen.getByText(/previous page/i);

    await waitFor(() => {
      userEvent.click(button);
    });

    expect(loadPrevious).toHaveBeenCalled();
  });
});
