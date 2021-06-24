import React, { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';
import {
  Box,
  CardMedia,
  CircularProgress,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from '@material-ui/core';
import { FormikValues, useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import {
  Button,
  FormikTextField,
  MarkdownPreview,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../';
import { useNotifications } from '../../hooks/useNotifications';
import { useStyles } from './StoryForm.styles';
import { validationSchema } from './StoryForm.validation';
import { client } from '../../api/client-api/client';
import { useGetStoryFromParserLazyQuery } from '../../api/client-api/generatedTypes';
import {
  CollectionStory,
  CollectionStoryAuthor,
} from '../../api/collection-api/generatedTypes';

interface StoryFormProps {
  /**
   * An object with everything story-related in it.
   */
  story: CollectionStory;

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
   * Whether to show the form in edit mode, that is, without the "Populate" button
   * and without scrolling the form into view on rendering all the fields.
   */
  editMode?: boolean;
}

export const StoryForm: React.FC<StoryFormProps & SharedFormButtonsProps> = (
  props
): JSX.Element => {
  const {
    story,
    onCancel,
    onSubmit,
    showAllFields = false,
    editMode = true,
  } = props;
  const classes = useStyles();

  // Prepare state vars and helper methods for API notifications
  const { showNotification } = useNotifications();

  // Whether to show the full form or just the URL field with the "Populate" button
  const [showOtherFields, setShowOtherFields] = useState<boolean>(
    showAllFields
  );

  // Listen for when the "Add Story" form opens up to show the rest of the fields
  // and scroll to the bottom to bring the entire form into view.
  useEffect(() => {
    if (!editMode) {
      window.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [showOtherFields, editMode]);

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
    validationSchema,
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
              <FormikTextField
                id="url"
                label="Story URL"
                fieldProps={formik.getFieldProps('url')}
                fieldMeta={formik.getFieldMeta('url')}
              />
            </Box>
            {!editMode && (
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
              <FormikTextField
                id="title"
                label="Title"
                fieldProps={formik.getFieldProps('title')}
                fieldMeta={formik.getFieldMeta('title')}
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
                <FormikTextField
                  id="authors"
                  label="Authors (separated by commas"
                  fieldProps={formik.getFieldProps('authors')}
                  fieldMeta={formik.getFieldMeta('authors')}
                />
              </Box>

              <FormikTextField
                id="publisher"
                label="Publisher"
                fieldProps={formik.getFieldProps('publisher')}
                fieldMeta={formik.getFieldMeta('publisher')}
              />
            </Grid>
            <Grid item xs={12}>
              <MarkdownPreview minHeight={6.5} source={formik.values.excerpt}>
                <FormikTextField
                  id="excerpt"
                  label="Excerpt"
                  fieldProps={formik.getFieldProps('excerpt')}
                  fieldMeta={formik.getFieldMeta('excerpt')}
                  multiline
                  rows={4}
                />
              </MarkdownPreview>
            </Grid>
            {formik.isSubmitting && (
              <Grid item xs={12}>
                <LinearProgress />
              </Grid>
            )}
            <Grid item xs={12}>
              <SharedFormButtons onCancel={onCancel} />
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
