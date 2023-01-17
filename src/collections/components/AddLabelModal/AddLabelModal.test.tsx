import React from 'react';
import { render, screen } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { MockedProvider } from '@apollo/client/testing';
import { AddLabelModal } from './AddLabelModal';

describe('The AddLabelModal component', () => {
  const toggleModal = jest.fn;

  it('should render the modal and the AddLabelForm component', () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <AddLabelModal isOpen={true} toggleModal={toggleModal} />
        </SnackbarProvider>
      </MockedProvider>
    );

    // using the modal heading to fetch it
    const addLabelModal = screen.getByText(/add a new label/i);

    // fetching the form component that is rendered within this modal component
    const addLabelForm = screen.getByLabelText(/label name/i);

    expect(addLabelModal).toBeInTheDocument();
    expect(addLabelForm).toBeInTheDocument();
  });
});
