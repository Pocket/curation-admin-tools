import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { RejectItemForm } from './RejectItemForm';
import userEvent from '@testing-library/user-event';

describe('The RejectItemForm component', () => {
  const handleSubmit = jest.fn();

  it('renders successfully', () => {
    render(<RejectItemForm onSubmit={handleSubmit} />);

    // there is at least a form and nothing falls over
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('has the requisite fields and buttons', () => {
    render(<RejectItemForm onSubmit={handleSubmit} />);

    const checkboxes = screen.getAllByRole('checkbox');
    // We have seven rejection reasons. They come from an enum in the Curated Corpus
    // API schema - RejectionReason and are available through the codegen types.
    expect(checkboxes).toHaveLength(7);

    const buttons = screen.getAllByRole('button');
    // "Save" and "Cancel" buttons are expected here.
    expect(buttons).toHaveLength(2);
  });

  it('displays an error message if no checkboxes have been selected', async () => {
    render(<RejectItemForm onSubmit={handleSubmit} />);

    await waitFor(() => {
      userEvent.click(screen.getByText(/save/i));
    });

    const errorMessage = screen.getByText(
      /Please specify at least one rejection reason./i,
    );
    expect(errorMessage).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits the form if at least one checkbox was selected', async () => {
    render(<RejectItemForm onSubmit={handleSubmit} />);

    const chosenReason = screen.getByLabelText(/time sensitive/i);
    await waitFor(() => {
      userEvent.click(chosenReason);
    });

    await waitFor(() => {
      userEvent.click(screen.getByText(/save/i));
    });

    expect(handleSubmit).toHaveBeenCalled();
  });
});
