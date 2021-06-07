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
  Typography,
} from '@material-ui/core';
import { Button, MarkdownPreview } from '../';
import { StoryModel } from '../../api/collection-api';
import { client, useGetStoryFromParserLazyQuery } from '../../api/client-api';
import { useStyles } from './StoryForm.styles';
import { CollectionStoryAuthor } from '../../api/collection-api/generatedTypes';
import { useNotifications } from '../../hooks/useNotifications';
import { ApolloError } from '@apollo/client';
import { FormikHelpers } from 'formik/dist/types';

interface StoryFormProps {
  /**
   * An object with everything story-related in it.
   */
  story: StoryModel;

  /**
   * What do we do with the submitted data?
   */
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;

  /**
   * Whether to show the full form or just the URL+Populate button
   * one-line version.
   */
  showAllFields?: boolean;

  /**
   * Whether to show the 'Populate' button. It's not needed if you edit
   * an existing story.
   */
  showPopulateButton?: boolean;

  /**
   * What to do if the user clicks on the Cancel button
   */
  onCancel?: () => void;
}

export const StoryForm: React.FC<StoryFormProps> = (props): JSX.Element => {
  const {
    story,
    onCancel,
    onSubmit,
    showAllFields = false,
    showPopulateButton = true,
  } = props;
  const classes = useStyles();

  // Prepare state vars and helper methods for API notifications
  const { showNotification } = useNotifications();

  // Whether to show the full form or just the URL field with the "Populate" button
  const [showOtherFields, setShowOtherFields] = useState<boolean>(
    showAllFields
  );

  // Which image do we show?
  const [imageSrc, setImageSrc] = useState<string>(
    story.imageUrl ? story.imageUrl : '/placeholders/story.svg'
  );

  /**
   * Set up form validation
   */
  const formik = useFormik({
    initialValues: {
      url: story.url ?? '',
      title: story.title ?? '',
      excerpt: story.excerpt ?? '',
      authors:
        story.authors
          .map((author: CollectionStoryAuthor) => {
            return author?.name;
          })
          .join(', ') ?? '',
      publisher: story.publisher ?? '',
    },
    // We don't want to irritate users by displaying validation errors
    // before they actually submit the form
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      url: yup.string().trim().required('Please enter a URL').min(12),
      title: yup.string().trim().required('Please enter a title').min(3),
      excerpt: yup.string().trim().required('Please enter an excerpt').min(12),
      authors: yup
        .string()
        .trim()
        .min(
          2, // minimum could be "AP"
          'Please enter one or more authors, separated by commas.' +
            ' Please supply at least two characters or leave this field empty' +
            ' if this story has no authors.'
        ),
      publisher: yup.string(),
    }),
    onSubmit: (values: FormikValues, formikHelpers: FormikHelpers<any>) => {
      onSubmit(values, formikHelpers);
    },
  });

  const [getStory, { loading }] = useGetStoryFromParserLazyQuery({
    client,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      // Rather than return errors if it can't parse a URL, the parser
      // returns a null object instead
      if (data.getItemByUrl) {
        // This is the success path

        // If the parser returns multiple authors for the story,
        // combine them in one comma-separated string
        const commaSeparatedAuthors = data.getItemByUrl.authors
          ?.map((author) => {
            return author?.name;
          })
          .join(', ');

        // set field values with data returned by the parser
        formik.setFieldValue('authors', commaSeparatedAuthors);

        // make sure to use the 'resolvedUrl returned from the parser instead of the URL
        // submitted by the user
        formik.setFieldValue('url', data.getItemByUrl.resolvedUrl);
        formik.setFieldValue('title', data.getItemByUrl.title);
        formik.setFieldValue(
          'publisher',
          data.getItemByUrl.domainMetadata?.name
        );
        formik.setFieldValue('excerpt', data.getItemByUrl.excerpt);

        // Work out the image URL, if any
        let imageUrl = '';

        if (
          data.getItemByUrl.topImageUrl &&
          data.getItemByUrl.topImageUrl.length > 0
        ) {
          // Use the publisher's preferred thumbnail image if it exists
          imageUrl = data.getItemByUrl.topImageUrl;
          setImageSrc(imageUrl);
        } else {
          // Try the images array - for YouTube, for example, this returns
          // the correct thumbnail
          if (data.getItemByUrl.images && data.getItemByUrl.images[0]) {
            imageUrl = data.getItemByUrl.images[0].src!;
            setImageSrc(imageUrl);
          } else {
            // Use the placeholder to display something on the frontend
            // while the imageUrl field remains empty as set initially
            setImageSrc('/placeholders/story.svg');
          }
        }

        // Save the normalised imageUrl value in a hidden input field
        // to upload to S3 later
        formik.setFieldValue('imageUrl', imageUrl);

        // And we're done!
        showNotification(
          `The parser finished processing this story`,
          'success'
        );
      } else {
        // This is the error path
        showNotification(`The parser couldn't process this URL`, 'error');
      }
      // If this is used to add a story and only the URL is visible,
      // show the other fields now that they contain something
      // even if the parser can't process the URL at all.
      setShowOtherFields(true);
    },
    onError: (error: ApolloError) => {
      // Show any other errors, i.e. cannot reach the API, etc.
      showNotification(error.message, 'error');
    },
  });

  const fetchStoryData = async () => {
    // Make sure we don't send an empty string to the parser
    await formik.setFieldTouched('url');
    await formik.validateField('url');

    // NB: this check doesn't work on initial page load because
    // formik.errors remains an empty object after validating
    // this field for the first time and the request is still sent
    // even though the field is empty and we see a validation error
    // in the UI. Subsequent user interactions with the form work as expected.
    // Marking this with a TODO to return to at some point in the future
    if (!formik.errors.url) {
      // Get story data from the parser. 'onComplete' callback specified
      // in the prepared query above will fill in the form with the returned data
      getStory({
        variables: {
          url: formik.values.url,
        },
      });
    }
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
            {showPopulateButton && (
              <Box alignSelf="baseline" ml={1}>
                <Button
                  buttonType="hollow"
                  onClick={fetchStoryData}
                  disabled={loading}
                >
                  Populate
                  {loading && (
                    <>
                      &nbsp;
                      <CircularProgress size={14} />
                    </>
                  )}
                </Button>
              </Box>
            )}
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
                src={imageSrc}
                alt={formik.values.title}
                className={classes.image}
              />
              <br />
              <Typography variant="caption">
                You can change this image in the list view.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Box mb={3}>
                <TextField
                  id="authors"
                  label="Authors (separated by commas)"
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
                <Box p={1}>
                  <Button buttonType="hollow-neutral" onClick={onCancel}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
      <Box display="none">
        <TextField
          type="hidden"
          id="imageUrl"
          label="imageUrl"
          {...formik.getFieldProps('imageUrl')}
        />
      </Box>
    </form>
  );
};
