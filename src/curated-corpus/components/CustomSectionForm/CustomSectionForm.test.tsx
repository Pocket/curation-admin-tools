import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomSectionForm } from './CustomSectionForm';

// Mock the DatePicker to avoid issues in tests
jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label, value, onChange, renderInput }: any) => {
    const mockParams = { label, value: value?.toString() || '' };
    return renderInput ? renderInput(mockParams) : <input aria-label={label} />;
  },
}));

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }: any) => <>{children}</>,
}));

jest.mock('@mui/x-date-pickers/AdapterLuxon', () => ({
  AdapterLuxon: jest.fn(),
}));

describe('CustomSectionForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form', () => {
    const { container } = render(
      <CustomSectionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(
      <CustomSectionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should show delete button in edit mode', () => {
    render(
      <CustomSectionForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        onDelete={mockOnDelete}
        isEditMode={true}
      />,
    );

    expect(
      screen.getByRole('button', { name: /delete section/i }),
    ).toBeInTheDocument();
  });

  it('should not show delete button in create mode', () => {
    render(
      <CustomSectionForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        onDelete={mockOnDelete}
        isEditMode={false}
      />,
    );

    expect(
      screen.queryByRole('button', { name: /delete section/i }),
    ).not.toBeInTheDocument();
  });

  it('should use custom submit button text', () => {
    render(
      <CustomSectionForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        submitButtonText="Save Changes"
      />,
    );

    expect(
      screen.getByRole('button', { name: /save changes/i }),
    ).toBeInTheDocument();
  });
});
