import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { ApolloError } from '@apollo/client';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddAuthorPage } from './AddAuthorPage';
import {
  CreateCollectionAuthorDocument,
  CreateCollectionAuthorInput,
} from '../../api/collection-api/generatedTypes';

describe('The AddAuthor page', () => {
  let addAuthorVariables: CreateCollectionAuthorInput;

  beforeEach(() => {
    addAuthorVariables = {
      name: 'Test Name',
      slug: 'test-name',
      bio:
        "I'm baby tousled tbh 8-bit poke farm-to-table poutine occupy " +
        "you probably haven't heard of them lomo chillwave. ",
      imageUrl: '',
    };
  });

  xit('shows an error if saving an author was unsuccessful', async () => {
    const mocksWithError: MockedResponse[] = [
      {
        request: {
          query: CreateCollectionAuthorDocument,
          variables: addAuthorVariables,
        },
        error: new ApolloError({
          networkError: new Error('An error occurred.'),
        }),
      },
    ];

    render(
      <MockedProvider mocks={mocksWithError} addTypename={false}>
        <AddAuthorPage />
      </MockedProvider>
    );

    // fill out the form
    userEvent.type(screen.getByLabelText(/full name/i), 'Test Name');
    userEvent.type(screen.getByLabelText(/slug/i), 'test-name');

    // submit it
    await waitFor(() => {
      userEvent.click(screen.getByText(/save/i));
    });

    // get response
    expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
  });
});
