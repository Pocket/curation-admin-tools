import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { RemoveSectionItemForm } from './RemoveSectionItemForm';
import userEvent from '@testing-library/user-event';

describe('The RemoveSectionItemForm component', () => {
  const handleSubmit = jest.fn();

  it('renders successfully', () => {
    render(<RemoveSectionItemForm onSubmit={handleSubmit} />);

    // there is at least a form and nothing falls over
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('has the requisite fields and buttons', () => {
    render(<RemoveSectionItemForm onSubmit={handleSubmit} />);

    const checkboxes = screen.getAllByRole('checkbox');
    // We have 12 removal reasons. They come from an enum in the Curated Corpus API schema.
    expect(checkboxes).toHaveLength(12);

    const buttons = screen.getAllByRole('button');
    // "Save" and "Cancel" buttons are expected here.
    expect(buttons).toHaveLength(2);
  });

  it('renders all expected removal reasons except ML', () => {
    render(<RemoveSectionItemForm onSubmit={handleSubmit} />);

    // "ML" reason should NOT be present
    const mlCheckbox = screen.queryByLabelText(/ml/i);
    expect(mlCheckbox).not.toBeInTheDocument();

    // These are the expected labels (adjust capitalization if needed)
    const expectedLabels = [
      /article quality/i,
      /controversial/i,
      /dated/i,
      /hed dek quality/i,
      /image quality/i,
      /no image/i,
      /off topic/i,
      /one sided/i,
      /paywall/i,
      /publisher quality/i,
      /set diversity/i,
      /other/i,
    ];

    expectedLabels.forEach((labelRegex) => {
      const checkbox = screen.getByLabelText(labelRegex);
      expect(checkbox).toBeInTheDocument();
    });
  });

  it('displays an error message if no checkboxes have been selected', async () => {
    render(<RemoveSectionItemForm onSubmit={handleSubmit} />);

    await waitFor(() => {
      userEvent.click(screen.getByText(/save/i));
    });

    const errorMessage = screen.getByText(
      /Please choose at least one removal reason./i,
    );
    expect(errorMessage).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits the form if at least one checkbox was selected', async () => {
    render(<RemoveSectionItemForm onSubmit={handleSubmit} />);

    const chosenReason = screen.getByLabelText(/paywall/i);
    await waitFor(() => {
      userEvent.click(chosenReason);
    });

    await waitFor(() => {
      userEvent.click(screen.getByText(/save/i));
    });

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('submits the form if more than one checkbox were selected', async () => {
    render(<RemoveSectionItemForm onSubmit={handleSubmit} />);
    const chosenReason1 = screen.getByLabelText(/paywall/i);
    await waitFor(() => {
      userEvent.click(chosenReason1);
    });

    const chosenReason2 = screen.getByLabelText(/dated/i);
    await waitFor(() => {
      userEvent.click(chosenReason2);
    });

    await waitFor(() => {
      userEvent.click(screen.getByText(/save/i));
    });

    expect(handleSubmit).toHaveBeenCalled();
  });
});
