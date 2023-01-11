import React from 'react';
import { Grid, LinearProgress } from '@material-ui/core';
import { FormikHelpers, FormikValues, useFormik } from 'formik';
import {
  FormikTextField,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';

import { validationSchema } from './AddLabelForm.validation';
import { useStyles } from './AddLabelForm.styles';

interface AddLabelFormProps {
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;

  // show/hide the loading bar on submissions
  isLoaderShowing: boolean;
}

/**
 * This component houses all the logic and data that will be used in this form.
 */
export const AddLabelForm: React.FC<
  AddLabelFormProps & SharedFormButtonsProps
> = (props) => {
  // get styles
  const classes = useStyles();

  // de-structure props
  const { onCancel, onSubmit, isLoaderShowing } = props;

  // set up formik object for this form
  const formik = useFormik({
    initialValues: {
      labelName: '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit,
  });

  return (
    <form
      name="add-label-form"
      onSubmit={formik.handleSubmit}
      className={classes.root}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormikTextField
            id="labelName"
            label="Label Name"
            fieldProps={formik.getFieldProps('labelName')}
            fieldMeta={formik.getFieldMeta('labelName')}
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          {isLoaderShowing && <LinearProgress />}
          <SharedFormButtons onCancel={onCancel} />
        </Grid>
      </Grid>
    </form>
  );
};
