import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { FormikSelectField } from './FormikSelectField';
import userEvent from '@testing-library/user-event';
import { FieldInputProps, FieldMetaProps } from 'formik/dist/types';

describe('The FormikSelectField component', () => {
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
      <FormikSelectField
        id="status"
        label="Test Dropdown"
        fieldProps={fieldProps}
        fieldMeta={fieldMeta}
      >
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
        <option value="4">Option 4</option>
      </FormikSelectField>
    );

    const field = screen.getByRole('combobox') as HTMLInputElement;
    expect(field).toBeInTheDocument();
  });

  it('updates the field value', async () => {
    render(
      <FormikSelectField
        id="status"
        label="Test Dropdown"
        fieldProps={fieldProps}
        fieldMeta={fieldMeta}
      >
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
        <option value="4">Option 4</option>
      </FormikSelectField>
    );

    const field = screen.getByRole('combobox') as HTMLSelectElement;

    await waitFor(() => {
      userEvent.selectOptions(field, ['3']);
    });

    // The verboseness of the following assertions is due to TypeScript
    // not being happy with option elements unless you cast them correctly -
    // in this case to HTMLOptionElement so that they definitely have
    // a 'selected' property
    const chosenOption = screen.getByRole('option', {
      name: 'Option 3',
    }) as HTMLOptionElement;
    expect(chosenOption.selected).toBe(true);

    // Check that the remaining options are not selected
    const optionOne = screen.getByRole('option', {
      name: 'Option 1',
    }) as HTMLOptionElement;
    expect(optionOne.selected).toBe(false);

    const optionTwo = screen.getByRole('option', {
      name: 'Option 2',
    }) as HTMLOptionElement;
    expect(optionTwo.selected).toBe(false);

    const optionFour = screen.getByRole('option', {
      name: 'Option 4',
    }) as HTMLOptionElement;
    expect(optionFour.selected).toBe(false);
  });
});
