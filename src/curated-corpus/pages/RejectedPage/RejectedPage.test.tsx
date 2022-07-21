import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { RejectedPage } from './RejectedPage';
import { render, screen, waitFor } from '@testing-library/react';
import { mock_AllRejectedItems } from '../../integration-test-mocks/getRejectedItems';

describe('The RejectedPage', () => {
  let mocks: MockedResponse[] = [];

  it('renders page basics on initial load', async () => {
    // Note: this test requires mocks for the rejected items query
    // and appears to run it, but doesn't display rejected items on the page.
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
  });

  it.todo('shows the number of rejected items displayed on initial load');

  it.todo('renders a full list of rejected items on initial load');

  it.todo('renders rejected items filtered by title');

  it.todo('renders rejected items filtered by topic');

  it.todo('renders rejected items filtered by language');

  it.todo('renders rejected items with a combination of filters applied');

  it.todo(
    'displays a full list of items after filtering and resetting filters'
  );

  it.todo('shows the next page of results');

  it.todo('navigates back to the previous page of results');
});
