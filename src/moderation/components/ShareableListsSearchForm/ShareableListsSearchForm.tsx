import React from 'react';
import { Box, Grid, LinearProgress, TextField } from '@mui/material';
import { Button } from '../../../_shared/components';
import { FormikValues, useFormik } from 'formik';
import { validationSchema } from './ShareableListsSearchForm.validation';

interface ShareableListsSearchFormProps {
  /**
   * What do we do with the submitted data?
   */
  onSubmit: (values: FormikValues) => void;
}

/**
 * A form for searching collections.
 */
export const ShareableListsSearchForm: React.FC<
  ShareableListsSearchFormProps
> = (props): JSX.Element => {
  const { onSubmit } = props;

  /**
   * Set up form validation
   */
  const formik = useFormik({
    initialValues: {
      externalId: '',
    },
    // We don't want to irritate users by displaying validation errors
    // before they actually submit the form
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.setSubmitting(false);
    },
  });

  return (
    <form name="shareable-lists-search-form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            id="externalId"
            label="List ID"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            variant="outlined"
            {...formik.getFieldProps('title')}
            error={!!(formik.touched.externalId && formik.errors.externalId)}
            helperText={formik.errors.externalId && formik.errors.externalId}
          />
        </Grid>

        {formik.isSubmitting && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}

        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <Box p={1}>
              <Button buttonType="positive" type="submit">
                Search
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};
