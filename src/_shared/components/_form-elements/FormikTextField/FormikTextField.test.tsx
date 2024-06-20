import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { FormikTextField } from './FormikTextField';
import userEvent from '@testing-library/user-event';
import { FieldInputProps, FieldMetaProps } from 'formik/dist/types';

describe('The FormikTextField component', () => {
  let fieldProps: FieldInputProps<any>;
  let fieldMeta: FieldMetaProps<any>;

  beforeEach(() => {
    fieldProps = {
      value: undefined,
      name: 'title',
      onChange: jest.fn(),
      onBlur: jest.fn(),
    };

    fieldMeta = {
      value: undefined,
      touched: false,
      initialTouched: false,
    };
  });

  it('renders with props', async () => {
    render(
      <FormikTextField
        id="title"
        label="Test Title"
        fieldProps={fieldProps}
        fieldMeta={fieldMeta}
      />,
    );

    const field = screen.getByRole('textbox') as HTMLInputElement;
    expect(field).toBeInTheDocument();
  });

  it('updates the field value', async () => {
    render(
      <FormikTextField
        id="title"
        label="Test Title"
        fieldProps={fieldProps}
        fieldMeta={fieldMeta}
      />,
    );

    const field = screen.getByRole('textbox') as HTMLInputElement;

    await waitFor(() => {
      userEvent.type(field, 'This is a test');
    });

    expect(field.value).toEqual('This is a test');
  });
});
