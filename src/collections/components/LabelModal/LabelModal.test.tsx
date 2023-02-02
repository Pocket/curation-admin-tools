import React from 'react';
import { render, screen } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { MockedProvider } from '@apollo/client/testing';
import { LabelModal } from './LabelModal';

describe('The LabelModal component', () => {
  const toggleModal = jest.fn;

  it('should render the modal and the LabelForm component', () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <LabelModal isOpen={true} toggleModal={toggleModal} />
        </SnackbarProvider>
      </MockedProvider>
    );

    // using the modal heading to fetch it
    const labelModal = screen.getByText(/add a new label/i);

    // fetching the form component that is rendered within this modal component
    const labelForm = screen.getByLabelText(/label name/i);

    expect(labelModal).toBeInTheDocument();
    expect(labelForm).toBeInTheDocument();
  });
});
