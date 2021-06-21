import React from 'react';
import { TextField } from '@material-ui/core';
import { FieldInputProps, FieldMetaProps } from 'formik/dist/types';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';

interface FormikTextFieldProps {
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
}

/**
 * A place where we can hide away some of the awkwardness of integrating Formik
 * with Material-UI input fields.
 *
 * This component relies on the form itself to call the useFormik() hook and pass
 * down the properties of interest to the field itself.
 */

export const FormikTextField: React.FC<
  FormikTextFieldProps & TextFieldProps
> = (props): JSX.Element => {
  const { id, label, fieldProps, fieldMeta, ...otherProps } = props;

  return (
    <TextField
      id={id}
      label={label}
      fullWidth
      InputLabelProps={{
        shrink: true,
      }}
      size="small"
      variant="outlined"
      {...fieldProps}
      error={!!(fieldMeta.touched && fieldMeta.error)}
      helperText={fieldMeta.error ? fieldMeta.error : null}
      {...otherProps}
    />
  );
};
