import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { RejectCorpusItemAction } from './RejectCorpusItemAction';
import { getTestApprovedItem } from '../../../helpers/approvedItem';
import {
  errorMock,
  successMock,
} from '../../../integration-test-mocks/rejectApprovedItem';
import userEvent from '@testing-library/user-event';
import { apolloCache } from '../../../../api/client';

describe('The RejectCorpusItemAction', () => {
  let mocks: MockedResponse[] = [];

  it('renders the modal', async () => {
    mocks = [];

    render(
      <MockedProvider mocks={mocks} cache={apolloCache}>
        <SnackbarProvider maxSnack={3}>
          <RejectCorpusItemAction
            item={getTestApprovedItem()}
            toggleModal={jest.fn()}
            modalOpen={true}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    // Do we have the modal heading
    expect(screen.getByText(/reject this item/i)).toBeInTheDocument();

    // How about the form?
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('completes the action successfully', async () => {
    mocks = [successMock];

    render(
      <MockedProvider mocks={mocks} cache={apolloCache}>
        <SnackbarProvider maxSnack={3}>
          <RejectCorpusItemAction
            item={getTestApprovedItem()}
            toggleModal={jest.fn()}
            modalOpen={true}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    const reason = screen.getByLabelText(/time sensitive/i);
    userEvent.click(reason);
    userEvent.click(screen.getByText(/save/i));

    expect(
      await screen.findByText(/item successfully moved to the rejected corpus/i)
    ).toBeInTheDocument();
  });

  /**
   * Note: this test *should* work but doesn't. There are past and open GitHub issues
   * about it on the Apollo Client project. Unskip this test when the promised overhaul
   * of the Mocked Provider materialises.
   *
   * https://github.com/apollographql/apollo-client/issues/4283 (closed)
   * https://github.com/apollographql/apollo-client/issues/7167 (open since 2020).
   *
   */
  xit('fails if approved item has scheduled entries', async () => {
    mocks = [errorMock];

    render(
      <MockedProvider
        mocks={mocks}
        cache={apolloCache}
        defaultOptions={{
          mutate: {
            errorPolicy: 'all',
          },
        }}
      >
        <SnackbarProvider maxSnack={3}>
          <RejectCorpusItemAction
            item={getTestApprovedItem({ externalId: '456-cde' })}
            toggleModal={jest.fn()}
            modalOpen={true}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    const reason = screen.getByLabelText(/time sensitive/i);
    userEvent.click(reason);
    userEvent.click(screen.getByText(/save/i));

    expect(
      await screen.findByText(
        /cannot remove item from approved corpus - scheduled entries exist/i
      )
    ).toBeInTheDocument();
  });
});
