import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RemoveItemConfirmationModal } from './RemoveItemConfirmationModal';

describe('RemoveItemConfirmationModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when open', () => {
    render(
      <RemoveItemConfirmationModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(screen.getByText('Remove Item from Section')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Are you sure you want to remove this item from the section\?/,
      ),
    ).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <RemoveItemConfirmationModal
        open={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(
      screen.queryByText('Remove Item from Section'),
    ).not.toBeInTheDocument();
  });

  it('should display item title when provided', () => {
    render(
      <RemoveItemConfirmationModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        itemTitle="Test Article Title"
      />,
    );

    expect(
      screen.getByText(
        'Are you sure you want to remove "Test Article Title" from the section?',
      ),
    ).toBeInTheDocument();
  });

  it('should display generic message when item title not provided', () => {
    render(
      <RemoveItemConfirmationModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(
      screen.getByText(
        'Are you sure you want to remove this item from the section?',
      ),
    ).toBeInTheDocument();
  });

  it('should call onClose when Cancel button is clicked', () => {
    render(
      <RemoveItemConfirmationModal
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

  it('should call onConfirm when OK button is clicked', () => {
    render(
      <RemoveItemConfirmationModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    const okButton = screen.getByRole('button', { name: /ok/i });
    fireEvent.click(okButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should have contained variant on OK button', () => {
    render(
      <RemoveItemConfirmationModal
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    const okButton = screen.getByRole('button', { name: /ok/i });
    expect(okButton).toHaveClass('MuiButton-contained');
  });
});
