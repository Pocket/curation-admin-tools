import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { SnackbarProvider } from 'notistack';
import { AddProspectForm } from './AddProspectForm';

describe('The AddProspectForm component', () => {
  const onSubmit = jest.fn();
  const onCancel = jest.fn();

  it('should render all the form fields and elements', () => {
    render(<AddProspectForm onSubmit={onSubmit} onCancel={onCancel} />);

    // Check if form input and buttons are rendered
    const urlInputField = screen.getByLabelText(/item url/i);
    expect(urlInputField).toBeInTheDocument();

    const saveButton = screen.getByText(/save/i);
    expect(saveButton).toBeInTheDocument();

    const cancelButton = screen.getByText(/cancel/i);
    expect(cancelButton).toBeInTheDocument();
  });

  it('should render error message when no URL is provided', async () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <AddProspectForm onSubmit={onSubmit} onCancel={onCancel} />
        </SnackbarProvider>
      </MockedProvider>
    );

    const saveButton = screen.getByText(/save/i);

    userEvent.click(saveButton);
    const emptyInputError = await screen.findByText(/please add an item url/i);

    expect(emptyInputError).toBeInTheDocument();
  });

  it('should render error message when an incorrect URL is provided', async () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <AddProspectForm onSubmit={onSubmit} onCancel={onCancel} />
        </SnackbarProvider>
      </MockedProvider>
    );

    const urlInputField = screen.getByLabelText(/item url/i);

    userEvent.type(urlInputField, 'test-incorrect-url');

    const saveButton = screen.getByText(/save/i);

    userEvent.click(saveButton);

    const incorrectUrlError = await screen.findByText(
      /please enter a valid url starting with https:\/\//i
    );

    expect(incorrectUrlError).toBeInTheDocument();
  });
});
