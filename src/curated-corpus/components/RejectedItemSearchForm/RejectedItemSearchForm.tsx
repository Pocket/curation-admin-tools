import React from 'react';
import { FormikHelpers, FormikValues, useFormik } from 'formik';
import { Grid } from '@material-ui/core';
import {
  Button,
  FormikSelectField,
  FormikTextField,
} from '../../../_shared/components';
import { validationSchema } from './RejectedtemSearchForm.validation';
import { languages, topics } from '../../helpers/definitions';

interface RejectedItemSearchFormProps {
  /**
   * What do we do with the submitted data?
   */
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
}

/**
 * A form for filtering and searching Rejected Items.
 */

export const RejectedItemSearchForm: React.FC<RejectedItemSearchFormProps> = (
  props
): JSX.Element => {
  const { onSubmit } = props;

  /**
   * Set up form validation
   */
  const formik = useFormik({
    initialValues: {
      title: '',
      topic: '',
      language: '',
      url: '',
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
    <form name="rejected-item-search-form" onSubmit={formik.handleSubmit}>
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
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12} sm={6}>
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
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} md={10}>
          <Button buttonType="positive" type="submit" fullWidth>
            Search
          </Button>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            buttonType="hollow-neutral"
            type="reset"
            fullWidth
            onClick={() => {
              formik.resetForm();
              formik.handleSubmit();
            }}
          >
            Reset Filters
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
