import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SharedFormButtons } from './SharedFormButtons';
import userEvent from '@testing-library/user-event';

describe('The SharedFormButtons component', () => {
  it('renders with default props', () => {
    render(<SharedFormButtons onCancel={jest.fn()} />);

    const saveButton = screen.getByText(/save/i);
    expect(saveButton).toBeInTheDocument();
  });

  it('renders with two buttons in edit mode', () => {
    render(<SharedFormButtons editMode={true} onCancel={jest.fn()} />);

    const saveButton = screen.getByText(/save/i);
    expect(saveButton).toBeInTheDocument();

    const cancelButton = screen.getByText(/cancel/i);
    expect(cancelButton).toBeInTheDocument();
  });

  it('calls the "onCancel" method when the "Cancel" button is clicked', async () => {
    const mockOnCancel = jest.fn();

    render(<SharedFormButtons editMode={true} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText(/cancel/i);

    await waitFor(() => {
      userEvent.click(cancelButton);
    });

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('calls the "onSave" method when the "Save" button is clicked', async () => {
    const mockOnSave = jest.fn();

    render(<SharedFormButtons onSave={mockOnSave} />);

    const saveButton = screen.getByText(/save/i);

    await waitFor(() => {
      userEvent.click(saveButton);
    });

    expect(mockOnSave).toHaveBeenCalled();
  });

  it('displays a custom label for the "Save" button if provided', () => {
    render(<SharedFormButtons saveButtonLabel="Confirm" />);

    expect(screen.queryByText(/save/i)).not.toBeInTheDocument();
    expect(screen.getByText(/confirm/i)).toBeInTheDocument();
  });
});
