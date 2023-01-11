import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { SnackbarProvider } from 'notistack';
import { AddLabelForm } from './AddLabelForm';

describe('The AddLabelForm component', () => {
  const onSubmit = jest.fn();
  const onCancel = jest.fn();

  it('should render all the form fields and elements', () => {
    render(
      <AddLabelForm
        onSubmit={onSubmit}
        onCancel={onCancel}
        isLoaderShowing={false}
      />
    );

    // Check if form input and buttons are rendered
    const urlInputField = screen.getByLabelText(/label name/i);
    expect(urlInputField).toBeInTheDocument();

    const saveButton = screen.getByText(/save/i);
    expect(saveButton).toBeInTheDocument();

    const cancelButton = screen.getByText(/cancel/i);
    expect(cancelButton).toBeInTheDocument();
  });

  it('should render error message when no label name is provided', async () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <AddLabelForm
            onSubmit={onSubmit}
            onCancel={onCancel}
            isLoaderShowing={false}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    const saveButton = screen.getByText(/save/i);

    userEvent.click(saveButton);
    const emptyInputError = await screen.findByText(/please add a label name/i);

    expect(emptyInputError).toBeInTheDocument();
  });
});
