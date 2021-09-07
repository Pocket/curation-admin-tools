import React from 'react';
import {
  Box,
  FormControlLabel,
  Grid,
  LinearProgress,
  Switch,
} from '@material-ui/core';
import slugify from 'slugify';
import { FormikValues, useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import {
  Button,
  FormikTextField,
  MarkdownPreview,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { validationSchema } from './AuthorForm.validation';
import { config } from '../../config';
import { CollectionAuthor } from '../../api/collection-api/generatedTypes';

interface AuthorFormProps {
  /**
   * An object with everything author-related in it.
   */
  author: CollectionAuthor;

  /**
   * What do we do with the submitted data?
   */
  onSubmit: (values: FormikValues, formikHelpers: FormikHelpers<any>) => void;
}

/**
 * A form for adding authors or editing information for existing authors
 */
export const AuthorForm: React.FC<AuthorFormProps & SharedFormButtonsProps> = (
  props
): JSX.Element => {
  const { author, onSubmit, editMode, onCancel } = props;

  /**
   * Set up form validation
   */
  const formik = useFormik({
    initialValues: {
      name: author.name ?? '',
      slug: author.slug ?? '',
      bio: author.bio ?? '',
      active: author.active ?? true,
    },
    // We don't want to irritate users by displaying validation errors
    // before they actually submit the form
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      onSubmit(values, formikHelpers);
    },
  });

  /**
   * Suggest a slug for the author - works off the "name" field
   */
  const suggestSlug = () => {
    const newSlug = slugify(formik.values.name, config.slugify);
    formik.setFieldValue('slug', newSlug);
  };

  return (
    <form name="author-form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormikTextField
            id="name"
            label="Full name"
            fieldProps={formik.getFieldProps('name')}
            fieldMeta={formik.getFieldMeta('name')}
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex">
            <Box flexGrow={1} alignSelf="center" textOverflow="ellipsis">
              <FormikTextField
                id="slug"
                label="Slug"
                fieldProps={formik.getFieldProps('slug')}
                fieldMeta={formik.getFieldMeta('slug')}
              />
            </Box>
            <Box alignSelf="baseline" ml={1}>
              <Button buttonType="hollow" onClick={suggestSlug}>
                Suggest&nbsp;slug
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <MarkdownPreview minHeight={15.5} source={formik.values.bio}>
            <FormikTextField
              id="bio"
              label="Bio"
              fieldProps={formik.getFieldProps('bio')}
              fieldMeta={formik.getFieldMeta('bio')}
              multiline
              rows={12}
            />
          </MarkdownPreview>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={formik.values.active}
                {...formik.getFieldProps('active')}
              />
            }
            label={formik.values.active ? 'Active' : 'Inactive'}
            labelPlacement="end"
          />
        </Grid>

        {formik.isSubmitting && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}

        <Grid item xs={12}>
          <SharedFormButtons editMode={editMode} onCancel={onCancel} />
        </Grid>
      </Grid>
    </form>
  );
};
