import React from 'react';
import { render, screen } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { MockedProvider } from '@apollo/client/testing';
import { ShareableListModal } from './ShareableListModal';
import {
  ShareableListComplete,
  ShareableListModerationStatus,
  ShareableListVisibility,
} from '../../../api/generatedTypes';

describe('The ShareableListModal component', () => {
  const toggleModal = jest.fn;
  const refetch = jest.fn;
  const list: ShareableListComplete = {
    externalId: '12345-qwerty',
    user: { id: '12345' },
    title: 'Test list title',
    description: 'Some description',
    slug: 'test-list-title',
    status: ShareableListVisibility.Public,
    moderationStatus: ShareableListModerationStatus.Visible,
    listItemNoteVisibility: ShareableListVisibility.Public,
    createdAt: '2023-03-27T11:54:03.000Z',
    updatedAt: '2023-03-28T23:09:57.000Z',
    listItems: [],
  };

  it('should render the modal and the ShareableListModerationForm component for hiding a list', () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <ShareableListModal
            isOpen={true}
            toggleModal={toggleModal}
            modalTitle={'Hide List'}
            refetch={refetch}
            shareableList={list}
            hideList={true} // this modal is in charge of moderating a list (hide), so passing flag
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    // using the modal heading to fetch it
    const shareableListModal = screen.getByText(/hide list/i);

    // fetching the form component that is rendered within this modal component
    const moderationReasonLabel = screen.getByLabelText(/moderation reason/i);
    const moderationDetailsLabel = screen.getByLabelText(/moderation details/i);

    expect(shareableListModal).toBeInTheDocument();
    expect(moderationReasonLabel).toBeInTheDocument();
    expect(moderationDetailsLabel).toBeInTheDocument();
  });

  it('should render the modal and the ShareableListRestorationForm component for restoring a list', () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <ShareableListModal
            isOpen={true}
            toggleModal={toggleModal}
            modalTitle={'Hide List'}
            refetch={refetch}
            shareableList={list}
            restoreList={true} // this modal is in charge of moderating a list (hide), so passing flag
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    // using the modal heading to fetch it
    const shareableListModal = screen.getByText(/hide list/i);

    // fetching the form component that is rendered within this modal component
    const restorationReasonLabel = screen.getByLabelText(/restoration reason/i);

    expect(shareableListModal).toBeInTheDocument();
    expect(restorationReasonLabel).toBeInTheDocument();
  });
});
