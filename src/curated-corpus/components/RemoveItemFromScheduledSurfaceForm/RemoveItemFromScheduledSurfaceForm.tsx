import React from 'react';
import { FormikHelpers, FormikValues, useFormik } from 'formik';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { validationSchema } from './RemoveItemFromScheduledSurface.validation';

interface RemoveItemFromScheduledSurfaceProps {
  /**
   * What do we do with the submitted data?
   */
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ) => void | Promise<any>;
  /**
   * Item title to be used in the checkbox description.
   */
  title: string;
}

export const RemoveItemFromScheduledSurfaceForm: React.FC<
  RemoveItemFromScheduledSurfaceProps & SharedFormButtonsProps
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
                  from this scheduled surface
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

        {formik.isSubmitting && (
          <Grid item xs={12}>
            <Box mb={3}>
              <LinearProgress />
            </Box>
          </Grid>
        )}
      </Grid>
      <SharedFormButtons onCancel={onCancel} />
    </form>
  );
};
