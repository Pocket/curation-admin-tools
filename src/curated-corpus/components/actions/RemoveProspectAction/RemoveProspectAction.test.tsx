import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { RemoveProspectAction } from './RemoveProspectAction';
import {
  successMock,
  errorMock,
  errorMessage,
} from '../../../integration-test-mocks/removeProspect';
import userEvent from '@testing-library/user-event';
import { apolloCache } from '../../../../api/client';
import { getTestProspect } from '../../../helpers/prospects';

describe('The RemoveProspectAction', () => {
  const prospectId = getTestProspect().id;
  const prospectTitle = getTestProspect().title;
  const prospectType = getTestProspect().prospectType;
  const onRemoveProspect = jest.fn();

  const renderComponent = (mocks?: MockedResponse[]) => {
    render(
      <MockedProvider mocks={mocks} cache={apolloCache}>
        <SnackbarProvider maxSnack={1}>
          <RemoveProspectAction
            prospectId={prospectId}
            prospectTitle={prospectTitle as string}
            prospectType={prospectType}
            modalOpen={false}
            toggleModal={jest.fn()}
            onRemoveProspect={onRemoveProspect}
          />
        </SnackbarProvider>
      </MockedProvider>
    );
  };

  it('should render the dismiss button and call the onRemoveProspect function without an error message', async () => {
    renderComponent([successMock]);

    const dismissBtn = screen.getByTestId('dismissButton');

    expect(dismissBtn).toBeInTheDocument();

    userEvent.click(dismissBtn);

    await waitFor(() => expect(onRemoveProspect).toHaveBeenCalledTimes(1));

    // asserting that onRemoveProspect is called with the correct arguments - error message should be undefined for a successful mutation call
    await waitFor(() =>
      expect(onRemoveProspect).toHaveBeenCalledWith(prospectId, undefined)
    );
  });

  /**
   * Note: This test is being skipped due to error mocks not working correctly.
   * Similar issue as one of the RejectCorpusItemAction test. Refer to the block comment there.
   *
   */
  xit('should render the dismiss button and call the onRemoveProspect function with an error message', async () => {
    //This test asserts that the onRemoveProspect callback is called
    //with the correct prospectId and errorMessage argument

    renderComponent([errorMock]);

    const dismissBtn = screen.getByTestId('dismissButton');

    expect(dismissBtn).toBeInTheDocument();

    userEvent.click(dismissBtn);

    await waitFor(() => expect(onRemoveProspect).toHaveBeenCalledTimes(1));

    // asserting that onRemoveProspect is called with the correct arguments
    await waitFor(() =>
      expect(onRemoveProspect).toHaveBeenCalledWith(prospectId, errorMessage)
    );
  });
});
