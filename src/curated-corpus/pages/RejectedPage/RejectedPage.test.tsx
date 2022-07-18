import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { RejectedPage } from './RejectedPage';
import { render, screen, waitFor } from '@testing-library/react';
import { mock_AllRejectedItems } from '../../integration-test-mocks/getRejectedItems';
import userEvent from '@testing-library/user-event';

describe('The RejectedPage', () => {
  let mocks: MockedResponse[] = [];

  it('renders all rejected items on initial load', async () => {
    mocks = [mock_AllRejectedItems];

    // Wrap the render call in a `waitFor` call to make sure
    // the initial render has finished.
    await waitFor(() => {
      render(
        <MockedProvider mocks={mocks}>
          <RejectedPage />
        </MockedProvider>
      );
    });

    // Do we have the famous heading?
    expect(screen.getByText(/ew tab/i)).toBeInTheDocument();

    // How about the form?
    expect(screen.getByRole('form')).toBeInTheDocument();

    // And the grid with rejected item cards? Nope

    // test test test
    // let's interact with this thing
    const titleField = screen.getByLabelText(/filter by title/i);
    userEvent.type(titleField, 'story');
    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'Search' }));
    });

    const resetButton = screen.getByRole('button', { name: 'Reset Filters' });
    expect(resetButton).toBeInTheDocument();
    await waitFor(() => {
      userEvent.click(resetButton);
    });
  });
});
