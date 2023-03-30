import React from 'react';
import { SnackbarProvider } from 'notistack';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { ShareableListFormConnector } from './ShareableListFormConnector';
import {
  list,
  moderationDetailsMultiLineText,
  moderateShareableList1SuccessMock,
} from '../../integration-test-mocks/moderateShareableLists';

describe('ShareableListFormConnector', () => {
  let mocks = [];
  const toggleModal = jest.fn();
  const refetch = jest.fn();

  it('loads the form with all labels and buttons', async () => {
    mocks = [moderateShareableList1SuccessMock];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <ShareableListFormConnector
            toggleModal={toggleModal}
            refetch={refetch}
            shareableList={list}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    // Wait for the form to load
    await screen.findByRole('form');

    // grab save button
    const saveButton = screen.getByRole('button', {
      name: /save/i,
    });
    expect(saveButton).toBeInTheDocument();

    // grab cancel button
    const cancelButton = screen.getByRole('button', {
      name: /cancel/i,
    });
    expect(cancelButton).toBeInTheDocument();

    // grab moderationReason field
    const moderationReasonField = screen.getByLabelText(/moderation reason/i);
    expect(moderationReasonField).toBeInTheDocument();

    // grab moderationDetails field
    const moderationDetailsField = screen.getByLabelText(/moderation details/i);
    expect(moderationDetailsField).toBeInTheDocument();
  });

  it('resolves in an error when empty label name', async () => {
    mocks = [moderateShareableList1SuccessMock];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <ShareableListFormConnector
            toggleModal={toggleModal}
            refetch={refetch}
            shareableList={list}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    // grab save button
    const saveButton = screen.getByText(/save/i);

    // grab moderationReason field
    const moderationReasonField = screen.getByLabelText(/moderation reason/i);
    expect(moderationReasonField).toBeInTheDocument();

    // click save button
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    // should resolve in error
    expect(
      screen.getByText('Please choose a reason for hiding this list.')
    ).toBeInTheDocument();
  });

  it('resolves in no errors, save button works, list is hidden', async () => {
    mocks = [moderateShareableList1SuccessMock];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <ShareableListFormConnector
            toggleModal={toggleModal}
            refetch={refetch}
            shareableList={list}
            runModerateShareableListMutation={true}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    // grab save button
    const saveButton = screen.getByText(/save/i);

    // grab moderationReason field
    const moderationReasonField = screen.getByLabelText(/moderation reason/i);
    expect(moderationReasonField).toBeInTheDocument();

    // grab moderationDetails field
    const moderationDetailsField = screen.getByLabelText(/moderation details/i);
    expect(moderationDetailsField).toBeInTheDocument();

    // select moderationReason
    userEvent.selectOptions(moderationReasonField, 'Spam');
    // enter moderationDetails
    userEvent.type(moderationDetailsField, moderationDetailsMultiLineText);

    // click save button
    userEvent.click(saveButton);

    await waitFor(() => expect(toggleModal).toHaveBeenCalled());
    await waitFor(() => expect(toggleModal).toHaveBeenCalledTimes(1));
  });

  it('cancel button works', async () => {
    mocks = [moderateShareableList1SuccessMock];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <ShareableListFormConnector
            toggleModal={toggleModal}
            refetch={refetch}
            shareableList={list}
            runModerateShareableListMutation={true}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    // grab cancel button
    const cancelButton = screen.getByText(/cancel/i);

    expect(cancelButton).toBeInTheDocument();

    await waitFor(() => {
      userEvent.click(cancelButton);
    });

    await waitFor(() => expect(toggleModal).toHaveBeenCalled());
    await waitFor(() => expect(toggleModal).toHaveBeenCalledTimes(1));
  });
});
