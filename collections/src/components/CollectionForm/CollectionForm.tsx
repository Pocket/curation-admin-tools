import React from 'react';
import slugify from 'slugify';
import * as yup from 'yup';
import { FormikValues, useFormik } from 'formik';

import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  Select,
  TextField,
} from '@material-ui/core';
import { AuthorModel, CollectionModel, CollectionStatus } from '../../api';
import { Button, MarkdownPreview } from '../';
import { useStyles } from './CollectionForm.styles';

interface CollectionFormProps {
  /**
   * An object with everything collection-related in it.
   */
  collection: CollectionModel;

  /**
   * A list of CollectionAuthor objects
   */
  authors: AuthorModel[];

  /**
   * What do we do with the submitted data?
   */
  onSubmit: (values: FormikValues) => void;

  /**
   * Show "Cancel" button if the form is used to edit a new collection
   * rather than add a new one. Also make "Status" field read-only
   * True by default
   */
  editMode?: boolean;

  /**
   * What to do if the user clicks on the Cancel button
   */
  onCancel?: () => void;
}

/**
 * A form for adding authors or editing information for existing authors
 */
export const CollectionForm: React.FC<CollectionFormProps> = (
  props
): JSX.Element => {
  const { collection, authors, editMode = true, onCancel, onSubmit } = props;
  const classes = useStyles();

  // get a list of author ids for the validation schema
  const authorIds: string[] = [];
  authors.forEach((author: AuthorModel) => {
    authorIds.push(author.externalId);
  });

  // if we're editing, grab the currently assigned author's external id
  const authorExternalId =
    collection.authors.length > 0 ? collection.authors[0].externalId : '';

  /**
   * Set up form validation
   */
  const formik = useFormik({
    initialValues: {
      title: collection.title ?? '',
      slug: collection.slug ?? '',
      excerpt: collection.excerpt ?? '',
      intro: collection.intro ?? '',
      status: collection.status ?? CollectionStatus.Draft,
      authorExternalId,
    },
    // We don't want to irritate users by displaying validation errors
    // before they actually submit the form
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: yup.object({
      title: yup
        .string()
        .required('Please enter a title for this collection')
        .min(6),
      slug: yup
        .string()
        .required(
          'Please enter a slug or use the "Suggest slug" button to generate one from the collection title'
        )
        .min(6),
      excerpt: yup.string(),
      intro: yup.string(),
      status: yup
        .mixed<CollectionStatus>()
        .oneOf(Object.values(CollectionStatus))
        .required(),
      authorExternalId: yup.string().oneOf(authorIds).required(),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  /**
   * Suggest a slug for the collection - works off the "title" field
   */
  const suggestSlug = () => {
    const newSlug = slugify(formik.values.title, { lower: true });
    formik.setFieldValue('slug', newSlug);
  };

  return (
    <form name="collection-form" onSubmit={formik.handleSubmit}>
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
            helperText={formik.errors.title ? formik.errors.title : null}
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex">
            <Box flexGrow={1} alignSelf="center" textOverflow="ellipsis">
              <TextField
                id="slug"
                label="Slug"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                size="small"
                variant="outlined"
                {...formik.getFieldProps('slug')}
                error={!!(formik.touched.slug && formik.errors.slug)}
                helperText={formik.errors.slug ? formik.errors.slug : null}
              />
            </Box>
            <Box alignSelf="baseline" ml={1}>
              <Button buttonType="hollow" onClick={suggestSlug}>
                Suggest&nbsp;slug
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="status" shrink={true}>
              Status
            </InputLabel>
            <Select
              native
              disabled={!editMode}
              label="Status"
              inputProps={{
                name: 'status',
                id: 'status',
              }}
              {...formik.getFieldProps('status')}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="authorExternalId" shrink={true}>
              Author
            </InputLabel>
            <Select
              native
              label="Author"
              inputProps={{
                name: 'authorExternalId',
                id: 'authorExternalId',
              }}
              {...formik.getFieldProps('authorExternalId')}
            >
              {authors.map((author: AuthorModel) => {
                return (
                  <option value={author.externalId} key={author.externalId}>
                    {author.name}
                  </option>
                );
              })}
            </Select>
          </FormControl>
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
              helperText={formik.errors.excerpt ? formik.errors.excerpt : null}
            />
          </MarkdownPreview>
        </Grid>

        <Grid item xs={12}>
          <MarkdownPreview minHeight={15.5} source={formik.values.intro}>
            <TextField
              id="intro"
              label="Intro"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              multiline
              rows={12}
              size="small"
              variant="outlined"
              {...formik.getFieldProps('intro')}
              error={!!(formik.touched.intro && formik.errors.intro)}
              helperText={formik.errors.intro ? formik.errors.intro : null}
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
            {editMode && (
              <Box p={1}>
                <Button buttonType="hollow-neutral" onClick={onCancel}>
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};
