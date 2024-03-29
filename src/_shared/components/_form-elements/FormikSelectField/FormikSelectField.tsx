import React from 'react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  SelectProps,
} from '@mui/material';
import { FieldInputProps, FieldMetaProps } from 'formik/dist/types';

interface FormikSelectFieldProps {
  /**
   * The id of the form field
   */
  id: string;

  /**
   * The label of the form field
   */
  label: string;

  /**
   * The output of formik.getFieldProps helper methods that add onChange, etc.
   * events to the field
   */
  fieldProps: FieldInputProps<any>;

  /**
   * The metadata for the field - we're especially interested in 'touched'
   * and 'error' properties.
   */
  fieldMeta: FieldMetaProps<any>;

  /**
   * Children elements - <option> tags
   */
  children: (JSX.Element | JSX.Element[])[];
}

/**
 * A place where we can hide away some of the awkwardness of integrating Formik
 * with Material UI dropdowns.
 *
 * This component relies on the form itself to call the useFormik() hook and pass
 * down the properties of interest to the field itself.
 */

export const FormikSelectField: React.FC<
  FormikSelectFieldProps & SelectProps
> = (props): JSX.Element => {
  const { id, label, fieldProps, fieldMeta, children, ...otherProps } = props;

  return (
    <FormControl
      variant="outlined"
      size="small"
      sx={{
        width: '100%',
      }}
    >
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        native
        label={label}
        inputProps={{
          name: id,
          id,
        }}
        {...fieldProps}
        error={!!(fieldMeta.touched && fieldMeta.error)}
        {...otherProps}
      >
        {children}
      </Select>
      <FormHelperText error>
        {fieldMeta.error ? fieldMeta.error : null}
      </FormHelperText>
    </FormControl>
  );
};
