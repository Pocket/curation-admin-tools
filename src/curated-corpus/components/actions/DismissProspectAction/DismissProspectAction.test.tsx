import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { DismissProspectAction } from './DismissProspectAction';
import {
  successMock,
  errorMock,
  errorMessage,
} from '../../../integration-test-mocks/removeProspect';
import userEvent from '@testing-library/user-event';
import { apolloCache } from '../../../../api/client';
import { getTestProspect } from '../../../helpers/prospects';

describe('The DismissProspectAction', () => {
  const prospectId = getTestProspect().id;
  const prospectTitle = getTestProspect().title;
  const prospectType = getTestProspect().prospectType;
  const onDismissProspect = jest.fn();

  const renderComponent = (mocks?: MockedResponse[]) => {
    render(
      <MockedProvider mocks={mocks} cache={apolloCache}>
        <SnackbarProvider maxSnack={1}>
          <DismissProspectAction
            prospectId={prospectId}
            prospectTitle={prospectTitle as string}
            prospectType={prospectType}
            modalOpen={false}
            toggleModal={jest.fn()}
            onDismissProspect={onDismissProspect}
          />
        </SnackbarProvider>
      </MockedProvider>
    );
  };

  it('should render the dismiss button and call the onDismissProspect function without an error message', async () => {
    renderComponent([successMock]);

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
   * Note: This test is being skipped due to error mocks not working correctly.
   * Similar issue as one of the RejectCorpusItemAction test. Refer to the block comment there.
   *
   */
  xit('should render the dismiss button and call the onDismissProspect function with an error message', async () => {
    //This test asserts that the onDismissProspect callback is called
    //with the correct prospectId and errorMessage argument

    renderComponent([errorMock]);

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
