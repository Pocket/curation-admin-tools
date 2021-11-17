import React from 'react';
import { FormikHelpers, FormikValues, useFormik } from 'formik';
import { Grid } from '@material-ui/core';
import { CuratedStatus } from '../../api/curated-corpus-api/generatedTypes';
import {
  Button,
  FormikSelectField,
  FormikTextField,
} from '../../../_shared/components';
import { validationSchema } from './ApprovedItemSearchForm.validation';
import { languages, topics } from '../../helpers/definitions';

interface ApprovedItemSearchFormProps {
  /**
   * What do we do with the submitted data?
   */
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
}

/**
 * A form for filtering and searching approved Curated Items.
 */
export const ApprovedItemSearchForm: React.FC<ApprovedItemSearchFormProps> = (
  props
): JSX.Element => {
  const { onSubmit } = props;

  /**
   * Set up form validation
   */
  const formik = useFormik({
    initialValues: {
      title: '',
      url: '',
      topic: '',
      language: '',
      status: '',
    },
    // We don't want to irritate users by displaying validation errors
    // before they actually submit the form
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      onSubmit(values, formikHelpers);
    },
  });

  return (
    <form name="approved-item-search-form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormikTextField
            id="title"
            label="Filter by Title"
            fieldProps={formik.getFieldProps('title')}
            fieldMeta={formik.getFieldMeta('title')}
          />
        </Grid>

        <Grid item xs={12}>
          <FormikTextField
            id="url"
            label="Filter by URL"
            fieldProps={formik.getFieldProps('url')}
            fieldMeta={formik.getFieldMeta('url')}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <FormikSelectField
            id="status"
            label="Status"
            fieldProps={formik.getFieldProps('status')}
            fieldMeta={formik.getFieldMeta('status')}
          >
            <option aria-label="None" value="" />
            <option value={CuratedStatus.Recommendation}>Recommendation</option>
            <option value={CuratedStatus.Corpus}>Corpus</option>
          </FormikSelectField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormikSelectField
            id="topic"
            label="Topic"
            fieldProps={formik.getFieldProps('topic')}
            fieldMeta={formik.getFieldMeta('topic')}
          >
            <option aria-label="None" value="" />
            {topics.map((topic) => {
              return (
                <option value={topic.code} key={topic.code}>
                  {topic.name}
                </option>
              );
            })}
          </FormikSelectField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormikSelectField
            id="language"
            label="Language"
            fieldProps={formik.getFieldProps('language')}
            fieldMeta={formik.getFieldMeta('language')}
          >
            <option aria-label="None" value="" />
            {languages.map((language) => {
              return (
                <option value={language.code} key={language.code}>
                  {language.name}
                </option>
              );
            })}
          </FormikSelectField>
        </Grid>
        <Grid item xs={12}>
          <Button buttonType="positive" type="submit" fullWidth>
            Search
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
