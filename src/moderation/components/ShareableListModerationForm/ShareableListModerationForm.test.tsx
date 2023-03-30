import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { SnackbarProvider } from 'notistack';
import { ShareableListModerationForm } from './ShareableListModerationForm';
import {
  list,
  moderationDetailsMultiLineText,
  moderateShareableList1SuccessMock,
} from '../../integration-test-mocks/moderateShareableLists';

describe('The ShareableListModerationForm component', () => {
  let mocks = [];
  const onSubmit = jest.fn();
  const onCancel = jest.fn();

  it('should render all the form fields and elements', () => {
    render(
      <ShareableListModerationForm
        onSubmit={onSubmit}
        onCancel={onCancel}
        isLoaderShowing={false}
        shareableList={list}
      />
    );

    // Check if form input and buttons are rendered
    const moderationReasonLabel = screen.getByLabelText(/moderation reason/i);
    expect(moderationReasonLabel).toBeInTheDocument();

    const saveButton = screen.getByText(/save/i);
    expect(saveButton).toBeInTheDocument();

    const cancelButton = screen.getByText(/cancel/i);
    expect(cancelButton).toBeInTheDocument();
  });

  it('should render error message when no moderationReason is provided', async () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <ShareableListModerationForm
            onSubmit={onSubmit}
            onCancel={onCancel}
            isLoaderShowing={false}
            shareableList={list}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    const saveButton = screen.getByText(/save/i);

    userEvent.click(saveButton);
    const emptyInputError = await screen.findByText(
      /Please choose a reason for hiding this list./i
    );

    expect(emptyInputError).toBeInTheDocument();
  });

  it('should successfully hide a list', async () => {
    mocks = [moderateShareableList1SuccessMock];
    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider maxSnack={3}>
          <ShareableListModerationForm
            onSubmit={onSubmit}
            onCancel={onCancel}
            isLoaderShowing={false}
            shareableList={list}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    const saveButton = screen.getByText(/save/i);

    // grab moderationReason field
    const moderationReasonField = screen.getByLabelText(/moderation reason/i);
    expect(moderationReasonField).toBeInTheDocument();
    // select moderationReason
    userEvent.selectOptions(moderationReasonField, 'Spam');

    // grab moderationDetails field
    const moderationDetailsField = screen.getByLabelText(/moderation details/i);
    expect(moderationDetailsField).toBeInTheDocument();
    // enter moderationDetails
    userEvent.type(moderationDetailsField, moderationDetailsMultiLineText);

    userEvent.click(saveButton);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });

  it('should successfully hide a list even when no moderationDetails are provided', async () => {
    mocks = [moderateShareableList1SuccessMock];
    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider maxSnack={3}>
          <ShareableListModerationForm
            onSubmit={onSubmit}
            onCancel={onCancel}
            isLoaderShowing={false}
            shareableList={list}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    const saveButton = screen.getByText(/save/i);

    // grab moderationReason field
    const moderationReasonField = screen.getByLabelText(/moderation reason/i);
    expect(moderationReasonField).toBeInTheDocument();
    // select moderationReason
    userEvent.selectOptions(moderationReasonField, 'Spam');

    userEvent.click(saveButton);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });

  it('cancel button should work', async () => {
    mocks = [moderateShareableList1SuccessMock];
    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider maxSnack={3}>
          <ShareableListModerationForm
            onSubmit={onSubmit}
            onCancel={onCancel}
            isLoaderShowing={false}
            shareableList={list}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    const cancelButton = screen.getByText(/cancel/i);

    userEvent.click(cancelButton);
    await waitFor(() => expect(onCancel).toHaveBeenCalled());
  });
});
