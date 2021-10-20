import React from 'react';
import { FormikValues, useFormik } from 'formik';
import { Box, Grid } from '@material-ui/core';
import {
  Button,
  FormikSelectField,
  FormikTextField,
} from '../../../_shared/components';
import { FormikHelpers } from 'formik/dist/types';

interface CuratedItemSearchFormProps {
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
export const CuratedItemSearchForm: React.FC<CuratedItemSearchFormProps> = (
  props
): JSX.Element => {
  const { onSubmit } = props;

  // Lifted from Collection API - Curation Categories
  // Where do we get this from/store in this tool?
  const topics = [
    { slug: 'business', name: 'Business' },
    { slug: 'career', name: 'Career' },
    { slug: 'coronavirus', name: 'Coronavirus' },
    { slug: 'education', name: 'Education' },
    { slug: 'entertainment', name: 'Entertainment' },
    { slug: 'food', name: 'Food' },
    { slug: 'health-and-fitness', name: 'Health & Fitness' },
    { slug: 'parenting', name: 'Parenting' },
    { slug: 'personal-finance', name: 'Personal Finance' },
    { slug: 'politics', name: 'Politics' },
    { slug: 'science', name: 'Science' },
    { slug: 'self-improvement', name: 'Self Improvement' },
    { slug: 'sports', name: 'Sports' },
    { slug: 'technology', name: 'Technology' },
    { slug: 'travel', name: 'Travel' },
  ];

  /**
   * Set up form validation
   */
  const formik = useFormik({
    initialValues: {
      title: '',
      url: '',
      topic: '',
      language: '',
    },
    // We don't want to irritate users by displaying validation errors
    // before they actually submit the form
    validateOnBlur: false,
    validateOnChange: false,
    // validationSchema: getValidationSchema(topics, languageCodes, statusCodes),
    onSubmit: (values, formikHelpers) => {
      onSubmit(values, formikHelpers);
    },
  });

  return (
    <form name="curated-item-search-form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormikTextField
            id="title"
            label="Title"
            fieldProps={formik.getFieldProps('title')}
            fieldMeta={formik.getFieldMeta('title')}
          />
        </Grid>

        <Grid item xs={12}>
          <FormikTextField
            id="url"
            label="URL"
            fieldProps={formik.getFieldProps('url')}
            fieldMeta={formik.getFieldMeta('url')}
          />
        </Grid>
      </Grid>

      <Grid container xs={12} spacing={2}>
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
                <option value={topic.slug} key={topic.slug}>
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
            <option value="en">English</option>
            <option value="de">German</option>
          </FormikSelectField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormikSelectField
            id="status"
            label="Status"
            fieldProps={formik.getFieldProps('status')}
            fieldMeta={formik.getFieldMeta('status')}
          >
            <option aria-label="None" value="" />
            <option value="RECOMMENDATION">Recommendation</option>
            <option value="CORPUS">Corpus</option>
          </FormikSelectField>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex">
            <Button buttonType="positive" type="submit" fullWidth>
              Search
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};
