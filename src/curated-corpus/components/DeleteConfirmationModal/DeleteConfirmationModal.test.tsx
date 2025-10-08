import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

describe('DeleteConfirmationModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when open', () => {
    render(
      <DeleteConfirmationModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(screen.getByText('Delete Section')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to delete this section? This action cannot be undone.',
      ),
    ).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <DeleteConfirmationModal
        open={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(screen.queryByText('Delete Section')).not.toBeInTheDocument();
  });

  it('should render custom title and message', () => {
    render(
      <DeleteConfirmationModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Custom Title"
        message="Custom message text"
      />,
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message text')).toBeInTheDocument();
  });

  it('should call onClose when Cancel button is clicked', () => {
    render(
      <DeleteConfirmationModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should call onConfirm when Delete button is clicked', () => {
    render(
      <DeleteConfirmationModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should have error color on Delete button', () => {
    render(
      <DeleteConfirmationModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toHaveClass('MuiButton-containedError');
  });
});
