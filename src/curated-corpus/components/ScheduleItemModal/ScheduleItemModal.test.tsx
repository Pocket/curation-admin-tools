import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { mock_AllScheduledSurfaces } from '../../integration-test-mocks/getScheduledSurfacesForUser';
import { mock_ScheduledItemCountsZero } from '../../integration-test-mocks/getScheduledItemCounts';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { ScheduleItemModal } from './ScheduleItemModal';
import { getTestApprovedItem } from '../../helpers/approvedItem';

describe('ScheduleItemModal', () => {
  const mocks: MockedResponse[] = [
    mock_AllScheduledSurfaces,
    mock_ScheduledItemCountsZero,
  ];

  const approvedItem = getTestApprovedItem();

  const renderComponent = (
    mocks: MockedResponse[],
    props: {
      headingCopy?: string;
      isOpen?: boolean;
      toggleModal?: VoidFunction;
    }
  ) => {
    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <ScheduleItemModal
            approvedItem={approvedItem}
            disableScheduledSurface={false}
            isOpen={props.isOpen ?? true}
            scheduledSurfaceGuid={'dummyId'}
            onSave={jest.fn()}
            toggleModal={props.toggleModal ?? jest.fn()}
            headingCopy={props.headingCopy ?? undefined}
          />
        </SnackbarProvider>
      </MockedProvider>
    );
  };

  it('is not visible on the screen unless open', async () => {
    renderComponent(mocks, { isOpen: false, headingCopy: 'Find me' });

    // Let's make sure the heading is not there
    expect(screen.queryByText('Find me')).not.toBeInTheDocument();

    // Wait for the form to load, then test whether we can see it
    const form = await screen.queryByRole('form');
    expect(form).not.toBeInTheDocument();
  });

  it('shows up on the screen when open', async () => {
    renderComponent(mocks, { isOpen: true, headingCopy: 'Find me' });

    // Let's make sure the heading is present
    expect(screen.queryByText('Find me')).toBeInTheDocument();

    // Wait for the form to load, then test whether we can see it
    const form = await screen.findByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('reacts to pressing the "Cancel" button', async () => {
    const toggleModal = jest.fn();

    renderComponent(mocks, { toggleModal });

    await screen.findByRole('form');

    userEvent.click(screen.getByText('Cancel'));
    expect(toggleModal).toBeCalled();
  });

  it('renders the default heading copy', () => {
    renderComponent(mocks, { isOpen: true });

    // Let's make sure the heading with the default copy is present
    expect(screen.queryByText('Schedule this item')).toBeInTheDocument();
  });

  it('renders the heading copy provided', () => {
    // In a way this is already tested in the "shows up on the screen" test,
    // but let's set up a separate unit test for completion
    const headingCopy = 'My custom header';

    renderComponent(mocks, { headingCopy });

    expect(screen.queryByText(headingCopy)).toBeInTheDocument();
  });
});
