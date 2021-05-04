import React from 'react';
import * as yup from 'yup';
import { FormikValues, useFormik } from 'formik';
import { Box, Grid, TextField } from '@material-ui/core';
import { Button } from '../Button/Button';

export const ParseUrlForm = () => {
  /**
   * Set up form validation
   */
  const formik = useFormik({
    initialValues: {
      url: '',
    },
    // We don't want to irritate users by displaying validation errors
    // before they actually submit the form
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      url: yup.string().required('Please enter a URL').min(12),
    }),
    onSubmit: (values) => {
      // onSubmit(values);
      console.log(values);
    },
  });

  const fetchStoryData = () => {
    //
  };

  return (
    <form name="story-form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex">
            <Box flexGrow={1} alignSelf="center" textOverflow="ellipsis">
              <TextField
                id="url"
                label="Story URL"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                size="small"
                variant="outlined"
                {...formik.getFieldProps('name')}
                error={!!(formik.touched.url && formik.errors.url)}
                helperText={formik.errors.url ? formik.errors.url : null}
              />
            </Box>
            <Box alignSelf="center" ml={1}>
              <Button buttonType="hollow" onClick={fetchStoryData}>
                Populate
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}></Grid>
      </Grid>
    </form>
  );
};
