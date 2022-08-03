import React from 'react';
import { render, screen } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { MockedProvider } from '@apollo/client/testing';
import { AddProspectModal } from './AddProspectModal';

describe('The AddProspectModal component', () => {
  const setApprovedItem = jest.fn;
  const setCurrentProspect = jest.fn;
  const setIsManualSubmission = jest.fn;
  const setIsRecommendation = jest.fn;
  const toggleApprovedItemModal = jest.fn;
  const toggleModal = jest.fn;
  const toggleScheduleItemModal = jest.fn;

  it('should render the modal and the AddProspect form component', () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <AddProspectModal
            isOpen={true}
            setApprovedItem={setApprovedItem}
            setCurrentProspect={setCurrentProspect}
            setIsManualSubmission={setIsManualSubmission}
            setIsRecommendation={setIsRecommendation}
            toggleApprovedItemModal={toggleApprovedItemModal}
            toggleModal={toggleModal}
            toggleScheduleItemModal={toggleScheduleItemModal}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    // using the modal heading to fetch it
    const addProspectModal = screen.getByText(/add a new curated item/i);

    // fetching the form component that is rendered within this modal component
    const addProspectForm = screen.getByLabelText(/item url/i);

    expect(addProspectModal).toBeInTheDocument();
    expect(addProspectForm).toBeInTheDocument();
  });
});
