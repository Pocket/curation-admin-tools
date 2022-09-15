import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { DismissProspectAction } from './DismissProspectAction';
import {
  successMock,
  errorMock,
  errorMessage,
} from '../../../integration-test-mocks/dismissProspect';
import userEvent from '@testing-library/user-event';
import { apolloCache } from '../../../../api/client';
import { getTestProspect } from '../../../helpers/prospects';

describe('The DismissProspectAction', () => {
  let mocks: MockedResponse[] = [];
  const prospectId = getTestProspect().id;
  const onDismissProspect = jest.fn();

  it('should render the dismiss button and call the onDismissProspect function without an error message', async () => {
    mocks = [successMock];

    render(
      <MockedProvider mocks={mocks} cache={apolloCache}>
        <SnackbarProvider maxSnack={1}>
          <DismissProspectAction
            prospectId={prospectId}
            onDismissProspect={onDismissProspect}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    const dismissBtn = screen.getByTestId('dismissButton');

    expect(dismissBtn).toBeInTheDocument();

    userEvent.click(dismissBtn);

    await waitFor(() => expect(onDismissProspect).toHaveBeenCalledTimes(1));

    // asserting that onDismissProspect is called with the correct arguments - error message should be undefined for a successful mutation call
    await waitFor(() =>
      expect(onDismissProspect).toHaveBeenCalledWith(prospectId, undefined)
    );
  });

  /**
   * Note: this test *should* work but doesn't. There are past and open GitHub issues
   * about it on the Apollo Client project. Unskip this test when the promised overhaul
   * of the Mocked Provider materialises.
   *
   * https://github.com/apollographql/apollo-client/issues/4283 (closed)
   * https://github.com/apollographql/apollo-client/issues/7167 (open since 2020).
   *
   */
  xit('should render the dismiss button and call the onDismissProspect function with an error message', async () => {
    mocks = [errorMock];

    render(
      <MockedProvider mocks={mocks} cache={apolloCache}>
        <SnackbarProvider maxSnack={1}>
          <DismissProspectAction
            prospectId={prospectId}
            onDismissProspect={onDismissProspect}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    const dismissBtn = screen.getByTestId('dismissButton');

    expect(dismissBtn).toBeInTheDocument();

    userEvent.click(dismissBtn);

    await waitFor(() => expect(onDismissProspect).toHaveBeenCalledTimes(1));

    // asserting that onDismissProspect is called with the correct arguments
    await waitFor(() =>
      expect(onDismissProspect).toHaveBeenCalledWith(prospectId, errorMessage)
    );
  });
});
