import React from 'react';
import { Box, Grid, LinearProgress } from '@material-ui/core';

import { FormikHelpers, FormikValues, useFormik } from 'formik';
import {
  FormikTextField,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';

import { validationSchema } from './AddProspectForm.validation';
import { useStyles } from './AddProspectForm.styles';

interface AddProspectFormProps {
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
}

/**
 * This component houses all the logic and data that will be used in this form.
 */
export const AddProspectForm: React.FC<
  AddProspectFormProps & SharedFormButtonsProps
> = (props) => {
  // get styles
  const classes = useStyles();

  // de-structure props
  const { onCancel, onSubmit } = props;

  // set up formik object for this form
  const formik = useFormik({
    initialValues: {
      itemUrl: '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit,
  });

  return (
    <>
      <form
        name="add-prospect-form"
        onSubmit={formik.handleSubmit}
        className={classes.root}
      >
        <Grid container>
          <Grid item xs={12}>
            <FormikTextField
              id="itemUrl"
              label="Item URL"
              fieldProps={formik.getFieldProps('itemUrl')}
              fieldMeta={formik.getFieldMeta('itemUrl')}
              autoFocus
            />

            <SharedFormButtons onCancel={onCancel} />
          </Grid>
        </Grid>

        {formik.isSubmitting && (
          <Grid item xs={12}>
            <Box mb={3}>
              <LinearProgress />
            </Box>
          </Grid>
        )}
      </form>
    </>
  );
};
