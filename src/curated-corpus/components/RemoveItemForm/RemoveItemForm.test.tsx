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
    // We have 16 removal reasons + Other checkbox (17 total). They come from an enum in the Curated Corpus
    // API schema - RemovalReason and are available through the codegen types.
    expect(checkboxes).toHaveLength(17);

    const buttons = screen.getAllByRole('button');
    // "Save" and "Cancel" buttons are expected here.
    expect(buttons).toHaveLength(2);

    const otherReasonLabel = screen.getByLabelText(/other/i);
    expect(otherReasonLabel).toBeInTheDocument();
  });

  it('displays an error message if no checkboxes or reason comment have been submitted', async () => {
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

  it('displays an error message if Other checkbox was selected but reason comment was not provided', async () => {
    render(<RemoveItemForm onSubmit={handleSubmit} />);

    const chosenReason = screen.getByLabelText(/other/i);
    await waitFor(() => {
      userEvent.click(chosenReason);
    });

    await waitFor(() => {
      userEvent.click(screen.getByText(/save/i));
    });

    const errorMessage = screen.getByText(
      /Please provide a comment for removing this item./i
    );
    expect(errorMessage).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('displays an error message if reason comment was provided but Other checkbox not selected', async () => {
    render(<RemoveItemForm onSubmit={handleSubmit} />);

    const reasonComment = screen.getByLabelText(/reason comment/i);
    // check that reason comment is disabled when Other checkbox is not selected
    expect(reasonComment).toHaveAttribute('disabled');
    const chosenReason = screen.getByLabelText(/other/i);
    await waitFor(() => {
      userEvent.click(chosenReason); // select
    });
    // check that reason comment is enabled when Other checkbox is selected
    expect(reasonComment).not.toHaveAttribute('disabled');
    // enter reason comment
    userEvent.type(reasonComment, 'other reason');

    await waitFor(() => {
      userEvent.click(chosenReason); // un-select
    });

    await waitFor(() => {
      userEvent.click(screen.getByText(/save/i));
    });

    const errorMessage = screen.getByText(
      /Please select the "Other" reason checkbox./i
    );
    expect(errorMessage).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('displays an error message if one checkbox + Other checkbox was selected, but reason comment not provided', async () => {
    render(<RemoveItemForm onSubmit={handleSubmit} />);

    const reasonComment = screen.getByLabelText(/reason comment/i);
    // check that reason comment is disabled when Other checkbox is not selected
    expect(reasonComment).toHaveAttribute('disabled');
    const otherReason = screen.getByLabelText(/other/i);
    await waitFor(() => {
      userEvent.click(otherReason); // select
    });
    // check that reason comment is enabled when Other checkbox is selected
    expect(reasonComment).not.toHaveAttribute('disabled');

    const nicheReason = screen.getByLabelText(/niche/i);
    await waitFor(() => {
      userEvent.click(nicheReason);
    });

    await waitFor(() => {
      userEvent.click(screen.getByText(/save/i));
    });

    const errorMessage = screen.getByText(
      /Please provide a comment for removing this item./i
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

  it('submits the form if at least the reason comment was entered + other checkbox selected', async () => {
    render(<RemoveItemForm onSubmit={handleSubmit} />);
    const reasonComment = screen.getByLabelText(/reason comment/i);
    // check that reason comment is disabled when Other checkbox is not selected
    expect(reasonComment).toHaveAttribute('disabled');
    const chosenReason = screen.getByLabelText(/other/i);
    await waitFor(() => {
      userEvent.click(chosenReason);
    });
    // check that reason comment is enabled when Other checkbox is selected
    expect(reasonComment).not.toHaveAttribute('disabled');
    // enter reason comment
    userEvent.type(reasonComment, 'other reason');

    await waitFor(() => {
      userEvent.click(screen.getByText(/save/i));
    });

    expect(handleSubmit).toHaveBeenCalled();
    // error message
    const errorMessage = screen.queryByText(
      /Please choose at least one removal reason./i
    );
    // check that error message is not in the form
    expect(errorMessage).not.toBeInTheDocument();
  });
});
