import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { SnackbarProvider } from 'notistack';
import { DuplicateProspectModal } from './DuplicateProspectModal';
import { getTestApprovedItem } from '../../helpers/approvedItem';
import userEvent from '@testing-library/user-event';

describe('The DuplicateProspectModal component', () => {
  const testApprovedItem = getTestApprovedItem();
  const toggleModal = jest.fn();
  // mocking the window object's open method
  const windowSpy = jest.spyOn(window, 'open');

  it('should render the modal and all its elements ', () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={1}>
          <DuplicateProspectModal
            approvedItem={testApprovedItem}
            isOpen={true}
            toggleModal={toggleModal}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    // fetch the modal by its heading and assert it rendered
    expect(screen.getByText(/duplicate item/i)).toBeInTheDocument();

    // fetch the item title in the modal and assert it rendered
    // NOTE: I have to include the ":" before the title, otherwise it is unable to fetch
    expect(screen.getByText(`: ${testApprovedItem.title}`)).toBeInTheDocument();

    // fetch modal body text and assert it rendered
    expect(
      screen.getByText(/this item is already in the corpus/i),
    ).toBeInTheDocument();

    // fetch the view item curation history button assert it rendered
    expect(
      screen.getByRole('button', { name: /view item curation history/i }),
    ).toBeInTheDocument();

    // fetch the cancel button assert it rendered
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should call functions attached to modal buttons ', () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={1}>
          <DuplicateProspectModal
            approvedItem={testApprovedItem}
            isOpen={true}
            toggleModal={toggleModal}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    const viewCurationHistoryButton = screen.getByRole('button', {
      name: /view item curation history/i,
    });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    userEvent.click(viewCurationHistoryButton);
    // assert that open method of the window object was called implying the link was opened in a new tab
    expect(windowSpy).toHaveBeenCalled();

    userEvent.click(cancelButton);
    // assert that toggle modal function was called when cancel button is clicked
    expect(toggleModal).toHaveBeenCalled();
  });
});
