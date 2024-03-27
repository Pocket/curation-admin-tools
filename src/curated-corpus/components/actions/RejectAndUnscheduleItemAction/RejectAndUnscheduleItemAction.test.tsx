import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { RejectAndUnscheduleItemAction } from './RejectAndUnscheduleItemAction';
import { getTestScheduledItem } from '../../../helpers/scheduledItem';
import { successMock as unscheduleItemSuccessMock } from '../../../integration-test-mocks/deleteScheduledCorpusItem';
import { successMock as rejectItemSuccessMock } from '../../../integration-test-mocks/rejectApprovedItem';
import userEvent from '@testing-library/user-event';
import { apolloCache } from '../../../../api/client';

describe('The RejectAndUnscheduleItemAction', () => {
  let mocks: MockedResponse[] = [];

  it('renders the modal', async () => {
    mocks = [];

    render(
      <MockedProvider mocks={mocks} cache={apolloCache}>
        <SnackbarProvider maxSnack={3}>
          <RejectAndUnscheduleItemAction
            item={getTestScheduledItem()}
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
    mocks = [unscheduleItemSuccessMock, rejectItemSuccessMock];

    render(
      <MockedProvider mocks={mocks} cache={apolloCache}>
        <SnackbarProvider maxSnack={3}>
          <RejectAndUnscheduleItemAction
            item={getTestScheduledItem()}
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
});
