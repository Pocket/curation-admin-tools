import React from 'react';
import * as yup from 'yup';
import { FormikValues, useFormik } from 'formik';

import {
  Box,
  Grid,
  InputLabel,
  LinearProgress,
  Select,
  TextField,
} from '@material-ui/core';
import { CollectionStatus } from '../../api/collection-api';
import { Button } from '../';

interface CollectionSearchFormProps {
  /**
   * What do we do with the submitted data?
   */
  onSubmit: (values: FormikValues) => void;
}

/**
 * A form for adding authors or editing information for existing authors
 */
export const CollectionSearchForm: React.FC<CollectionSearchFormProps> = (
  props
): JSX.Element => {
  const { onSubmit } = props;

  /**
   * Set up form validation
   */
  const formik = useFormik({
    initialValues: {
      title: '',
      author: '',
      status: '',
      filterRequired: '',
    },
    // We don't want to irritate users by displaying validation errors
    // before they actually submit the form
    validateOnBlur: false,
    validateOnChange: false,
    // TODO: we should write a custom validator that makes sure at least one of the
    // fields is filled out
    validationSchema: yup.object({
      title: yup.string().min(3),
      author: yup.string().min(3),
      status: yup
        .mixed<CollectionStatus>()
        .oneOf(Object.values(CollectionStatus)),
      filterRequired: yup.bool().when(['title', 'author', 'status'], {
        is: (title: any, author: any, status: any) =>
          !title && !author && !status,
        then: yup.bool().required('at least one filter is required'),
        otherwise: yup.bool(),
      }),
    }),
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
            error={
              !!(formik.touched.title && formik.errors.title) ||
              !!(formik.errors && formik.errors.filterRequired)
            }
            helperText={
              (formik.errors.title && formik.errors.title) ||
              (formik.errors && formik.errors.filterRequired)
            }
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
            error={
              !!(formik.touched.author && formik.errors.author) ||
              !!(formik.errors && formik.errors.filterRequired)
            }
            helperText={
              (formik.errors.author && formik.errors.author) ||
              (formik.errors && formik.errors.filterRequired)
            }
          />
        </Grid>

        <Grid item xs={12}>
          <InputLabel htmlFor="status" shrink={true}>
            Status
          </InputLabel>
          <Select
            variant="outlined"
            label="Status"
            fullWidth
            inputProps={{
              name: 'status',
              id: 'status',
            }}
            {...formik.getFieldProps('status')}
            error={!!(formik.errors && formik.errors.filterRequired)}
          >
            <option value=""></option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
          {formik.errors && formik.errors.filterRequired && (
            <div className="MuiFormHelperText-root MuiFormHelperText-contained Mui-error MuiFormHelperText-marginDense">
              {formik.errors.filterRequired}
            </div>
          )}
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
