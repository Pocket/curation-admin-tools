import React, { useState } from 'react';
import { Box, Grid, LinearProgress, TextField } from '@material-ui/core';
import { Button, FormikSelectField } from '../../../_shared/components';
import { FormikValues, useFormik } from 'formik';
import { validationSchema } from './CollectionSearchForm.validation';
import { Autocomplete } from '@material-ui/lab';
import { Label } from '../../../api/generatedTypes';

interface CollectionSearchFormProps {
  /**
   * All the labels in the system we can filter by.
   */
  labels: Label[];

  /**
   * What do we do with the submitted data?
   */
  onSubmit: (values: FormikValues) => void;
}

/**
 * A form for searching collections.
 */
export const CollectionSearchForm: React.FC<CollectionSearchFormProps> = (
  props
): JSX.Element => {
  const { labels, onSubmit } = props;

  // Keep track of selected labels
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);

  // Update labels if the user has made any changes
  const handleLabelChange = (e: React.ChangeEvent<unknown>, value: Label[]) => {
    setSelectedLabels(value);

    // Explicitly set labels within the validation library, too - otherwise the value
    // sent through is undefined
    formik.setFieldValue('labels', value);
  };

  /**
   * Set up form validation
   */
  const formik = useFormik({
    initialValues: {
      title: '',
      author: '',
      status: '',
      labels: [],
      filterRequired: '',
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
    <form name="collection-search-form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            id="title"
            label="Title"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            variant="outlined"
            {...formik.getFieldProps('title')}
            error={!!(formik.touched.title && formik.errors.title)}
            helperText={formik.errors.title && formik.errors.title}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            id="author"
            label="Author"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            variant="outlined"
            {...formik.getFieldProps('author')}
            error={!!(formik.touched.author && formik.errors.author)}
            helperText={formik.errors.author}
          />
        </Grid>

        <Grid item xs={12}>
          <FormikSelectField
            id="status"
            label="Status"
            fieldProps={formik.getFieldProps('status')}
            fieldMeta={formik.getFieldMeta('status')}
          >
            <option value=""></option>
            <option value="DRAFT">Draft</option>
            <option value="REVIEW">Review</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </FormikSelectField>
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="labels"
            onChange={handleLabelChange}
            options={labels}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) =>
              option.externalId === value.externalId
            }
            value={selectedLabels}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Labels"
                placeholder="Add a label"
              />
            )}
          />
        </Grid>

        {formik.errors && formik.errors.filterRequired && (
          <Grid item xs={12}>
            <div className="MuiFormHelperText-root MuiFormHelperText-contained Mui-error MuiFormHelperText-marginDense">
              {formik.errors.filterRequired}
            </div>
          </Grid>
        )}

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
