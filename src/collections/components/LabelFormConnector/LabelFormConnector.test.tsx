import React from 'react';
import { SnackbarProvider } from 'notistack';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { LabelFormConnector } from './LabelFormConnector';
import {
  createLabel1SuccessMock,
  createLabel2SuccessMock,
  createDuplicateLabelErrorMock,
  createMinCharLabelErrorMock,
  createBadCharLabelErrorMock,
} from '../../integration-test-mocks/createLabels';
import {
  updateLabel1SuccessMock,
  updateDuplicateLabelErrorMock,
  updateCollectionLabelAssociationErrorMock,
} from '../../integration-test-mocks/updateLabels';
import { Label } from '../../../api/generatedTypes';

describe('LabelFormConnector', () => {
  let mocks = [];
  const toggleModal = jest.fn();

  it('loads the form with all labels and buttons', async () => {
    mocks = [createLabel1SuccessMock, createLabel2SuccessMock];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <LabelFormConnector toggleModal={toggleModal} />
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
          <LabelFormConnector toggleModal={toggleModal} />
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

  it('resolves in a duplicate error when creating label', async () => {
    mocks = [createDuplicateLabelErrorMock];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <LabelFormConnector
            toggleModal={toggleModal}
            runCreateLabelMutation={true}
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

    // grab label field
    const lableNameField = screen.getByLabelText(/label name/i);
    expect(lableNameField).toBeInTheDocument();
    // enter label name which already exists
    userEvent.type(lableNameField, 'fake-label-duplicate');
    // click save button
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    // should resolve in duplicate error
    expect(
      screen.getByText(
        'A label with the name "fake-label-duplicate" already exists'
      )
    ).toBeInTheDocument();
  });

  it('resolves in a duplicate error when updating label', async () => {
    mocks = [updateDuplicateLabelErrorMock];
    const label: Label = {
      externalId: 'duplicate-label',
      name: 'fake-label-duplicate-update',
    };

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <LabelFormConnector
            toggleModal={toggleModal}
            label={label}
            runUpdateLabelMutation={true}
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

    // grab label field
    const lableNameField = screen.getByLabelText(/label name/i);
    // the lableNameField should already be pre-filled so we don't neeed to enter a label name
    expect(lableNameField).toBeInTheDocument();
    // click save button
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    // should resolve in duplicate error
    expect(
      screen.getByText(
        'A label with the name "fake-label-duplicate-update" already exists'
      )
    ).toBeInTheDocument();
  });

  it('resolves in a collection-label association error when updating label', async () => {
    mocks = [updateCollectionLabelAssociationErrorMock];
    const label: Label = {
      externalId: 'label-1',
      name: 'fake-read-label',
    };

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <LabelFormConnector
            toggleModal={toggleModal}
            label={label}
            runUpdateLabelMutation={true}
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

    // first clear the pre-filled input
    userEvent.clear(screen.getByLabelText(/label name/i));
    // grab label field
    const lableNameField = screen.getByLabelText(/label name/i);
    expect(lableNameField).toBeInTheDocument();
    // enter updated label name
    userEvent.type(lableNameField, 'fake-obsessed-label');
    // click save button
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    // should resolve in duplicate error
    expect(
      screen.getByText(
        'Cannot update label; it is associated with at least one collection'
      )
    ).toBeInTheDocument();
  });

  it('resolves in a min length error', async () => {
    mocks = [createMinCharLabelErrorMock];

    render(
      <MockedProvider>
        <SnackbarProvider>
          <LabelFormConnector toggleModal={toggleModal} />
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
          <LabelFormConnector toggleModal={toggleModal} />
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

  it('resolves in no errors, save button works, label created', async () => {
    mocks = [createLabel1SuccessMock];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <LabelFormConnector
            toggleModal={toggleModal}
            runCreateLabelMutation={true}
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

  it('resolves in no errors, save button works, label updated', async () => {
    mocks = [updateLabel1SuccessMock];
    const label: Label = {
      externalId: 'label-1',
      name: 'fake-old-label',
    };

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <LabelFormConnector
            toggleModal={toggleModal}
            runUpdateLabelMutation={true}
            label={label}
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

    // first clear the pre-filled input
    userEvent.clear(screen.getByLabelText(/label name/i));
    // grab label field
    const lableNameField = screen.getByLabelText(/label name/i);
    expect(lableNameField).toBeInTheDocument();
    // enter updated label name
    userEvent.type(lableNameField, 'fake-new-label');
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
          <LabelFormConnector toggleModal={toggleModal} />
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
