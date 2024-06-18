import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { RemoveItemFromScheduledSurfaceForm } from './RemoveItemFromScheduledSurfaceForm';
import userEvent from '@testing-library/user-event';

describe('The RemoveItemFromScheduledSurfaceForm component', () => {
  const handleSubmit = jest.fn();

  it('renders successfully', () => {
    render(
      <RemoveItemFromScheduledSurfaceForm
        onSubmit={handleSubmit}
        title="This is a test"
      />,
    );

    // there is at least a form and nothing falls over
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('has the requisite fields and buttons', () => {
    render(
      <RemoveItemFromScheduledSurfaceForm
        onSubmit={handleSubmit}
        title="This is a test"
      />,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    // There is just the one checkbox that asks to check it to confirm
    // the decision to delete a scheduled item
    expect(checkboxes).toHaveLength(1);

    const buttons = screen.getAllByRole('button');
    // "Save" and "Cancel" buttons are expected here.
    expect(buttons).toHaveLength(2);
  });

  it('displays an error message if no checkboxes have been selected', async () => {
    render(
      <RemoveItemFromScheduledSurfaceForm
        onSubmit={handleSubmit}
        title="This is a test"
      />,
    );

    await waitFor(() => {
      userEvent.click(screen.getByText(/save/i));
    });

    const errorMessage = screen.getByText(
      /Please confirm your intention to remove this item./i,
    );
    expect(errorMessage).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits the form if the checkbox was selected', async () => {
    render(
      <RemoveItemFromScheduledSurfaceForm
        onSubmit={handleSubmit}
        title="This is a test"
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    await waitFor(() => {
      userEvent.click(checkbox);
    });

    await waitFor(() => {
      userEvent.click(screen.getByText(/save/i));
    });

    expect(handleSubmit).toHaveBeenCalled();
  });
});
