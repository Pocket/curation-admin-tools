import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { SnackbarProvider } from 'notistack';

import { AddProspectModal } from './../AddProspectModal/AddProspectModal';
import { AddProspectForm } from './AddProspectForm';

import { getApprovedItemByUrl } from '../../../api/queries/getApprovedItemByUrl';
import { getUrlMetadata } from '../../../api/queries/getUrlMetadata';

describe('The AddProspectForm component', () => {
  const toggleModal = jest.fn();
  const onCancel = jest.fn();

  it('should render all the form fields and elements', () => {
    // this test also renders the AddProspectModal component which in turn tests AddProspectModal component

    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <AddProspectModal isOpen={true} toggleModal={toggleModal}>
            <AddProspectForm
              toggleAddProspectModal={toggleModal}
              onCancel={onCancel}
            />
          </AddProspectModal>
        </SnackbarProvider>
      </MockedProvider>
    );

    // Check if the modal title is rendered
    const title = screen.getByText(/add a new curated item/i);
    expect(title).toBeInTheDocument();

    // Check if form input and buttons are rendered
    const urlInputField = screen.getByLabelText(/item url/i);
    expect(urlInputField).toBeInTheDocument();

    const saveButton = screen.getByText(/save/i);
    expect(saveButton).toBeInTheDocument();

    const cancelButton = screen.getByText(/cancel/i);
    expect(cancelButton).toBeInTheDocument();
  });

  it('should render error message when no url is provided', async () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <AddProspectForm
            toggleAddProspectModal={toggleModal}
            onCancel={onCancel}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    //const urlInputField = screen.getByLabelText(/item url/i);

    //userEvent.type(urlInputField, null);

    const saveButton = screen.getByText(/save/i);

    userEvent.click(saveButton);
    const emptyInputError = await screen.findByText(/please add an item url/i);

    expect(emptyInputError).toBeInTheDocument();
  });

  it('should render error message when an incorrect url is provided', async () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <AddProspectForm
            toggleAddProspectModal={toggleModal}
            onCancel={onCancel}
          />
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

  it('should render approved item modal when a correct url is provided', async () => {
    // mock meta data object that will be used in the apollo provider mock
    // to be returned as one of the query results
    const mockUrlMetadata = {
      url: 'https://www.test-website.com/test',
      title: 'mock-test-title',
      imageUrl: 'mock-test-image-url',
      publisher: 'mock-test-publisher',
      language: 'mock-test-language',
      isSyndicated: false,
      isCollection: false,
      excerpt: 'mock-test-excerpt',
    };

    // mocks for the MockApolloProvider to mock query requests and responses
    const providerMocks = [
      {
        request: {
          query: getApprovedItemByUrl,
          variables: {
            url: 'https://www.test-website.com/test',
          },
        },
        result: {
          data: {
            getApprovedCuratedCorpusItemByUrl: null,
          },
        },
      },
      {
        request: {
          query: getUrlMetadata,
          variables: {
            url: 'https://www.test-website.com/test',
          },
        },
        result: {
          data: {
            getUrlMetadata: { ...mockUrlMetadata },
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={providerMocks}>
        <SnackbarProvider maxSnack={3}>
          <AddProspectForm
            toggleAddProspectModal={toggleModal}
            onCancel={onCancel}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    const urlInputField = screen.getByLabelText(/item url/i);

    userEvent.type(urlInputField, 'https://www.test-website.com/test');

    const saveButton = screen.getByText(/save/i);

    userEvent.click(saveButton);

    const approvedItemModal = await screen.findByText(/review item/i);

    expect(approvedItemModal).toBeInTheDocument();
  });
});
