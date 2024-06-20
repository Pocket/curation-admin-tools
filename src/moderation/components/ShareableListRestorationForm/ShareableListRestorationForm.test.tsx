import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { SnackbarProvider } from 'notistack';
import { ShareableListRestorationForm } from './ShareableListRestorationForm';
import {
  hiddenList,
  moderationDetailsMultiLineText,
  restoreShareableList1SuccessMock,
} from '../../integration-test-mocks/moderateShareableLists';

describe('The ShareableListRestorationForm component', () => {
  let mocks = [];
  const onSubmit = jest.fn();
  const onCancel = jest.fn();

  it('should render all the form fields and elements', () => {
    render(
      <ShareableListRestorationForm
        onSubmit={onSubmit}
        onCancel={onCancel}
        isLoaderShowing={false}
        shareableList={hiddenList}
      />,
    );

    // Check if form input and buttons are rendered
    const restorationReasonLabel = screen.getByLabelText(/restoration reason/i);
    expect(restorationReasonLabel).toBeInTheDocument();

    const saveButton = screen.getByText(/save/i);
    expect(saveButton).toBeInTheDocument();

    const cancelButton = screen.getByText(/cancel/i);
    expect(cancelButton).toBeInTheDocument();
  });

  it('should render error message when no restorationReason is provided', async () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <ShareableListRestorationForm
            onSubmit={onSubmit}
            onCancel={onCancel}
            isLoaderShowing={false}
            shareableList={hiddenList}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    const saveButton = screen.getByText(/save/i);

    userEvent.click(saveButton);
    const emptyInputError = await screen.findByText(
      /Please enter a reason for restoring this list./i,
    );

    expect(emptyInputError).toBeInTheDocument();
  });

  it('should successfully restore a list', async () => {
    mocks = [restoreShareableList1SuccessMock];
    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider maxSnack={3}>
          <ShareableListRestorationForm
            onSubmit={onSubmit}
            onCancel={onCancel}
            isLoaderShowing={false}
            shareableList={hiddenList}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    const saveButton = screen.getByText(/save/i);

    // grab restorationReason field
    const restorationReasonField = screen.getByLabelText(/restoration reason/i);
    expect(restorationReasonField).toBeInTheDocument();
    // enter restorationReason
    userEvent.type(restorationReasonField, moderationDetailsMultiLineText);

    userEvent.click(saveButton);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });

  it('cancel button should work', async () => {
    mocks = [restoreShareableList1SuccessMock];
    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider maxSnack={3}>
          <ShareableListRestorationForm
            onSubmit={onSubmit}
            onCancel={onCancel}
            isLoaderShowing={false}
            shareableList={hiddenList}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    const cancelButton = screen.getByText(/cancel/i);

    userEvent.click(cancelButton);
    await waitFor(() => expect(onCancel).toHaveBeenCalled());
  });
});
