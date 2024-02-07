import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { RemoveItemForm } from './RemoveItemForm';
import userEvent from '@testing-library/user-event';

describe('The RemoveItemForm component', () => {
  const handleSubmit = jest.fn();

  it('renders successfully', () => {
    render(<RemoveItemForm onSubmit={handleSubmit} />);

    // there is at least a form and nothing falls over
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('has the requisite fields and buttons', () => {
    render(<RemoveItemForm onSubmit={handleSubmit} />);

    const checkboxes = screen.getAllByRole('checkbox');
    // We have 16 removal reasons. They come from an enum in the Curated Corpus
    // API schema - RemovalReason and are available through the codegen types.
    expect(checkboxes).toHaveLength(16);

    const buttons = screen.getAllByRole('button');
    // "Save" and "Cancel" buttons are expected here.
    expect(buttons).toHaveLength(2);

    const otherReasonLabel = screen.getByLabelText(/other/i);
    expect(otherReasonLabel).toBeInTheDocument();
  });

  it('displays an error message if no checkboxes or other reason have been selected', async () => {
    render(<RemoveItemForm onSubmit={handleSubmit} />);

    await waitFor(() => {
      userEvent.click(screen.getByText(/save/i));
    });

    const errorMessage = screen.getByText(
      /Please choose at least one removal reason./i
    );
    expect(errorMessage).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits the form if at least one checkbox was selected', async () => {
    render(<RemoveItemForm onSubmit={handleSubmit} />);

    const chosenReason = screen.getByLabelText(/niche/i);
    await waitFor(() => {
      userEvent.click(chosenReason);
    });

    await waitFor(() => {
      userEvent.click(screen.getByText(/save/i));
    });

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('submits the form if at least the other reason was entered', async () => {
    render(<RemoveItemForm onSubmit={handleSubmit} />);

    const chosenReason = screen.getByLabelText(/other/i);
    // enter restorationReason
    userEvent.type(chosenReason, 'other reason');

    await waitFor(() => {
      userEvent.click(screen.getByText(/save/i));
    });

    expect(handleSubmit).toHaveBeenCalled();
  });
});
