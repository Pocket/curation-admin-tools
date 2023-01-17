import React from 'react';
import { SnackbarProvider } from 'notistack';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { AddLabelFormConnector } from './AddLabelFormConnector';
import {
  createLabel1SuccessMock,
  createLabel2SuccessMock,
  createDuplicateLabelErrorMock,
  createMinCharLabelErrorMock,
  createBadCharLabelErrorMock,
} from '../../integration-test-mocks/createLabels';

describe('AddLabelFormConnector', () => {
  let mocks = [];
  const toggleModal = jest.fn();

  it('loads the form with all labels and buttons', async () => {
    mocks = [createLabel1SuccessMock, createLabel2SuccessMock];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <AddLabelFormConnector toggleModal={toggleModal} />
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

    // grab label field
    const lableNameField = screen.getByLabelText(/label name/i);
    expect(lableNameField).toBeInTheDocument();
  });

  it('resolves in an error when empty label name', async () => {
    mocks = [createLabel1SuccessMock, createLabel2SuccessMock];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <AddLabelFormConnector toggleModal={toggleModal} />
        </SnackbarProvider>
      </MockedProvider>
    );

    // Wait for the form to load
    await screen.findByRole('form');

    // grab save button
    const saveButton = screen.getByRole('button', {
      name: /save/i,
    });

    // grab label field
    const lableNameField = screen.getByLabelText(/label name/i);
    expect(lableNameField).toBeInTheDocument();
    // don't enter label name
    userEvent.type(lableNameField, ' ');
    // click save button
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    // should resolve in error
    expect(screen.getByText('Please add a label name.')).toBeInTheDocument();
  });

  it('resolves in a duplicate error', async () => {
    mocks = [createDuplicateLabelErrorMock];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <AddLabelFormConnector toggleModal={toggleModal} />
        </SnackbarProvider>
      </MockedProvider>
    );

    // Wait for the form to load
    await screen.findByRole('form');

    // grab save button
    const saveButton = screen.getByRole('button', {
      name: /save/i,
    });

    // grab label field
    const lableNameField = screen.getByLabelText(/label name/i);
    expect(lableNameField).toBeInTheDocument();
    // enter label name which already exists
    userEvent.type(lableNameField, 'fake-label-2');
    // click save button
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    // should resolve in duplicate error
    expect(
      screen.getByText('A label with the name "fake-label-2" already exists')
    ).toBeInTheDocument();
  });

  it('resolves in a min length error', async () => {
    mocks = [createMinCharLabelErrorMock];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <AddLabelFormConnector toggleModal={toggleModal} />
        </SnackbarProvider>
      </MockedProvider>
    );

    // Wait for the form to load
    await screen.findByRole('form');

    // grab save button
    const saveButton = screen.getByRole('button', {
      name: /save/i,
    });

    // grab label field
    const lableNameField = screen.getByLabelText(/label name/i);
    expect(lableNameField).toBeInTheDocument();
    // enter label name of one char
    userEvent.type(lableNameField, 'a');
    // click save button
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    // should resolve in min length error
    expect(
      screen.getByText('Label name needs to be at least 2 characters.')
    ).toBeInTheDocument();
  });

  it('resolves in a bad char error', async () => {
    mocks = [createBadCharLabelErrorMock];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <AddLabelFormConnector toggleModal={toggleModal} />
        </SnackbarProvider>
      </MockedProvider>
    );

    // Wait for the form to load
    await screen.findByRole('form');

    // grab save button
    const saveButton = screen.getByRole('button', {
      name: /save/i,
    });

    // grab label field
    const lableNameField = screen.getByLabelText(/label name/i);
    expect(lableNameField).toBeInTheDocument();
    // enter label name with special char
    userEvent.type(lableNameField, 'fake-label!');
    // click save button
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    // should resolve in min length error
    expect(
      screen.getByText(
        'Label name can only contain lowercase alphanumeric characters and hyphens.'
      )
    ).toBeInTheDocument();
  });

  it('resolves in no errors, save button works', async () => {
    mocks = [createLabel1SuccessMock];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <AddLabelFormConnector toggleModal={toggleModal} />
        </SnackbarProvider>
      </MockedProvider>
    );

    // Wait for the form to load
    await screen.findByRole('form');

    // grab save button
    const saveButton = screen.getByRole('button', {
      name: /save/i,
    });

    // grab label field
    const lableNameField = screen.getByLabelText(/label name/i);
    expect(lableNameField).toBeInTheDocument();
    // enter label name
    userEvent.type(lableNameField, 'fake-label-1');
    // click save button
    await waitFor(() => {
      userEvent.click(saveButton);
    });

    await waitFor(() => expect(toggleModal).toHaveBeenCalled());
    await waitFor(() => expect(toggleModal).toHaveBeenCalledTimes(1));
  });

  it('cancel button works', async () => {
    mocks = [createLabel1SuccessMock];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <AddLabelFormConnector toggleModal={toggleModal} />
        </SnackbarProvider>
      </MockedProvider>
    );

    // Wait for the form to load
    await screen.findByRole('form');

    // grab cancel button
    const cancelButton = screen.getByRole('button', {
      name: /cancel/i,
    });
    expect(cancelButton).toBeInTheDocument();

    await waitFor(() => {
      userEvent.click(cancelButton);
    });

    await waitFor(() => expect(toggleModal).toHaveBeenCalled());
    await waitFor(() => expect(toggleModal).toHaveBeenCalledTimes(1));
  });
});
