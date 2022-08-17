import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  mock_approvedItemByExternalId,
  mock_approvedItemByExternalIdNoResults,
} from '../../integration-test-mocks/approvedItemByExternalId';
import { CorpusItemPage } from './CorpusItemPage';

describe('The CorpusItemPage', () => {
  let mocks: MockedResponse[] = [];

  it('renders the page after the initial load', async () => {
    mocks = [mock_approvedItemByExternalId];

    await waitFor(() => {
      render(
        <MemoryRouter initialEntries={['/curated-corpus/corpus/item/123-abc/']}>
          <Route path="/curated-corpus/corpus/item/:id/">
            <MockedProvider mocks={mocks}>
              <CorpusItemPage />
            </MockedProvider>
          </Route>
        </MemoryRouter>
      );
    });
    // Wait for the query to run before looking up elements on the page
    await waitFor(() => {
      expect(
        screen.getByText('How To Win Friends And Influence People with React')
      ).toBeInTheDocument();
    });
  });

  it('renders the page with an error message if an item was not found', async () => {
    mocks = [mock_approvedItemByExternalIdNoResults];

    // Wrap the render call in a `waitFor` call to make sure
    // the initial render has finished.
    await waitFor(() => {
      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter
            initialEntries={['/curated-corpus/corpus/item/123-abc/']}
          >
            <CorpusItemPage />
          </MemoryRouter>
        </MockedProvider>
      );
    });
  });
});
