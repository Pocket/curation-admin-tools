import React, { useState } from 'react';
import * as yup from 'yup';
import { FormikValues, useFormik } from 'formik';
import {
  Box,
  CardMedia,
  CircularProgress,
  Grid,
  LinearProgress,
  TextField,
} from '@material-ui/core';
import { Button, MarkdownPreview } from '../';
import { StoryModel } from '../../api';
import { clientAPIClient } from '../../api/client';
import { useGetStoryFromParserLazyQuery } from '../../api/client-api/generatedTypes';
import { useStyles } from './StoryForm.styles';

interface StoryFormProps {
  /**
   * An object with everything story-related in it.
   */
  story: StoryModel;

  /**
   * What do we do with the submitted data?
   */
  onSubmit: (values: FormikValues) => void;
}

export const StoryForm: React.FC<StoryFormProps> = (props): JSX.Element => {
  const { story, onSubmit } = props;
  const classes = useStyles();

  const [showOtherFields, setShowOtherFields] = useState<boolean>(false);

  /**
   * Set up form validation
   */
  const formik = useFormik({
    initialValues: {
      url: story.url ?? '',
      title: story.title ?? '',
      excerpt: story.excerpt ?? '',
      authors: story.authors[0].name ?? '',
      publisher: story.publisher ?? '',
    },
    // We don't want to irritate users by displaying validation errors
    // before they actually submit the form
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      url: yup.string().required('Please enter a URL').min(12),
      title: yup.string().required('Please enter a title').min(12),
      excerpt: yup.string().required('Please enter an excerpt').min(12),
      authors: yup.string().required('Please enter one or more authors').min(6),
      publisher: yup.string(),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const [getStory, { loading, data }] = useGetStoryFromParserLazyQuery({
    client: clientAPIClient,
    onCompleted: (data) => {
      // If the parser returns multiple authors for the story,
      // combine them in one comma-separated string
      const commaSeparatedAuthors = data.getItemByUrl?.authors
        ?.map((author) => {
          return author?.name;
        })
        .join(', ');

      // set field values with data returned by the parser
      formik.setFieldValue('authors', commaSeparatedAuthors);

      formik.setFieldValue('title', data.getItemByUrl?.title);
      formik.setFieldValue(
        'publisher',
        data.getItemByUrl?.domainMetadata?.name
      );
      formik.setFieldValue('excerpt', data.getItemByUrl?.excerpt);

      // if this is used to add a story and only the URL is visible,
      // show the other fields now that they contain something
      setShowOtherFields(true);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const fetchStoryData = () => {
    // Get story data from the parser. 'onComplete' callback specified
    // in the prepared query above will fill in the form with the returned data
    getStory({
      variables: {
        url: formik.values.url,
      },
    });
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
                {...formik.getFieldProps('url')}
                error={!!(formik.touched.url && formik.errors.url)}
                helperText={formik.errors.url ? formik.errors.url : null}
              />
            </Box>
            <Box alignSelf="center" ml={1}>
              <Button buttonType="hollow" onClick={fetchStoryData}>
                Populate
                {loading && (
                  <>
                    &nbsp;
                    <CircularProgress size={14} />
                  </>
                )}
              </Button>
            </Box>
          </Box>
        </Grid>

        {showOtherFields && (
          <>
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
                helperText={formik.errors.title ? formik.errors.title : null}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CardMedia
                component="img"
                src={
                  data?.getItemByUrl?.topImageUrl
                    ? data?.getItemByUrl?.topImageUrl
                    : '/placeholders/collection.svg'
                }
                alt={formik.values.title}
                className={classes.image}
              />
            </Grid>
            <Grid item xs={12} sm={9}>
              <Box mb={3}>
                <TextField
                  id="authors"
                  label="Authors"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  size="small"
                  variant="outlined"
                  {...formik.getFieldProps('authors')}
                  error={!!(formik.touched.authors && formik.errors.authors)}
                  helperText={
                    formik.errors.authors ? formik.errors.authors : null
                  }
                />
              </Box>

              <TextField
                id="publisher"
                label="Publisher"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                size="small"
                variant="outlined"
                {...formik.getFieldProps('publisher')}
                error={!!(formik.touched.publisher && formik.errors.publisher)}
                helperText={
                  formik.errors.publisher ? formik.errors.publisher : null
                }
              />
            </Grid>
            <Grid item xs={12}>
              <MarkdownPreview minHeight={6.5} source={formik.values.excerpt}>
                <TextField
                  id="excerpt"
                  label="Excerpt"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  multiline
                  rows={4}
                  size="small"
                  variant="outlined"
                  {...formik.getFieldProps('excerpt')}
                  error={!!(formik.touched.excerpt && formik.errors.excerpt)}
                  helperText={
                    formik.errors.excerpt ? formik.errors.excerpt : null
                  }
                />
              </MarkdownPreview>
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
                    Save
                  </Button>
                </Box>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </form>
  );
};
