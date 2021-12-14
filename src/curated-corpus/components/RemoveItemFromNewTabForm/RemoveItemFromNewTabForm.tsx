import React from 'react';
import { FormikHelpers, FormikValues, useFormik } from 'formik';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  Typography,
} from '@material-ui/core';
import {
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { validationSchema } from './RemoveItemFromNewTabForm.validation';

interface RemoveItemFromNewTabFormProps {
  /**
   * What do we do with the submitted data?
   */
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
  /**
   * Item title to be used in the checkbox description.
   */
  title: string;
}

export const RemoveItemFromNewTabForm: React.FC<
  RemoveItemFromNewTabFormProps & SharedFormButtonsProps
> = (props): JSX.Element => {
  const { onCancel, onSubmit, title } = props;

  const formik = useFormik({
    initialValues: {
      confirmRemoval: false,
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      // Send the values along to the parent function call that will run the mutation
      onSubmit(values, formikHelpers);
    },
  });
  return (
    <form name="reject-item-form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  {...formik.getFieldProps({
                    name: 'confirmRemoval',
                  })}
                />
              }
              label={
                <>
                  Yes, I want to remove{' '}
                  <Typography color="primary" component="span">
                    {title}
                  </Typography>{' '}
                  from New Tab
                </>
              }
            />
            <FormHelperText error>
              {formik.getFieldMeta('confirmRemoval').error
                ? formik.getFieldMeta('confirmRemoval').error
                : null}
            </FormHelperText>
          </FormGroup>
        </Grid>
      </Grid>
      <SharedFormButtons onCancel={onCancel} />
    </form>
  );
};
