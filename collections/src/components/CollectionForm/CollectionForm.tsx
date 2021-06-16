import React, { useState } from 'react';
import slugify from 'slugify';
import * as yup from 'yup';
import { FormikValues, useFormik } from 'formik';

import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  LinearProgress,
  Select,
  TextField,
} from '@material-ui/core';
import {
  AuthorModel,
  CollectionModel,
  CollectionStatus,
} from '../../api/collection-api';
import { Button, MarkdownPreview } from '../';
import { useStyles } from './CollectionForm.styles';
import { FormikHelpers } from 'formik/dist/types';
import { config } from '../../config';
import {
  CurationCategory,
  IabCategory,
  IabParentCategory,
} from '../../api/collection-api/generatedTypes';

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
   * A list of curation categories
   */
  curationCategories: CurationCategory[];

  /**
   * A list of IAB categories
   */
  iabCategories: IabParentCategory[];

  /**
   * What do we do with the submitted data?
   */
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;

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
  const {
    authors,
    collection,
    curationCategories,
    iabCategories,
    editMode = true,
    onSubmit,
    onCancel,
  } = props;
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
      curationCategoryExternalId: collection.curationCategory?.externalId ?? '',
      IABParentCategoryExternalId:
        collection.IABParentCategory?.externalId ?? '',
      IABChildCategoryExternalId: collection.IABChildCategory?.externalId ?? '',
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
        .trim()
        .required(
          'Please enter a slug or use the "Suggest slug" button to generate one from the collection title'
        )
        .matches(
          /^[a-z0-9-]+$/,
          'Slug can only contain lowercase alphanumeric characters and hyphens'
        )
        .min(6),
      excerpt: yup.string(),
      intro: yup.string(),
      status: yup
        .mixed<CollectionStatus>()
        .oneOf(Object.values(CollectionStatus))
        .required(),
      authorExternalId: yup
        .string()
        .oneOf(authorIds)
        .required('Please choose an author'),
      curationCategoryExternalId: yup.string(),
      IABParentCategoryExternalId: yup.string(),
      // If an IAB parent category is chosen, require the IAB child category
      // to be filled in as well.
      IABChildCategoryExternalId: yup
        .string()
        .when('IABParentCategoryExternalId', {
          is: (value: string) => value && value.length > 0,
          then: yup
            .string()
            .required(
              'Please choose a child IAB category or leave both IAB categories blank'
            ),
          otherwise: yup.string(),
        }),
    }),
    onSubmit: (values, formikHelpers) => {
      onSubmit(values, formikHelpers);
    },
  });

  /**
   * Suggest a slug for the collection - works off the "title" field
   */
  const suggestSlug = () => {
    const newSlug = slugify(formik.values.title, config.slugify);
    formik.setFieldValue('slug', newSlug);
  };

  /**
   * Work out which IAB child category to show when an IAB parent category is chosen
   */
  const [iabChildrenCategories, setIabChildrenCategories] = useState<
    IabCategory[]
  >([]);
  React.useEffect(() => {
    // Determine which IAB parent category has been chosen
    const currentIabParentCategory = iabCategories.find((category) => {
      return category.externalId === formik.values.IABParentCategoryExternalId;
    });

    if (currentIabParentCategory) {
      // Use its children as the dependent "IAB Child Category"
      // dropdown options.
      setIabChildrenCategories(currentIabParentCategory.children);
    } else {
      // No parent IAB category has been chosen - unset child categories
      setIabChildrenCategories([]);
    }
  }, [
    formik.touched.IABParentCategoryExternalId,
    formik.values.IABParentCategoryExternalId,
    iabCategories,
  ]);

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
            <InputLabel htmlFor="authorExternalId">Author</InputLabel>
            <Select
              native
              label="Author"
              inputProps={{
                name: 'authorExternalId',
                id: 'authorExternalId',
              }}
              {...formik.getFieldProps('authorExternalId')}
              error={
                !!(
                  formik.touched.authorExternalId &&
                  formik.errors.authorExternalId
                )
              }
            >
              <option aria-label="None" value="" />
              {authors.map((author: AuthorModel) => {
                return (
                  <option value={author.externalId} key={author.externalId}>
                    {author.name}
                  </option>
                );
              })}
            </Select>
            <FormHelperText error>
              {formik.errors.authorExternalId
                ? formik.errors.authorExternalId
                : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="curationCategoryExternalId">
              Curation Category
            </InputLabel>
            <Select
              native
              label="CurationCategory"
              inputProps={{
                name: 'curationCategoryExternalId',
                id: 'curationCategoryExternalId',
              }}
              {...formik.getFieldProps('curationCategoryExternalId')}
              error={
                !!(
                  formik.touched.curationCategoryExternalId &&
                  formik.errors.curationCategoryExternalId
                )
              }
            >
              <option aria-label="None" value="" />
              {curationCategories.map((category: CurationCategory) => {
                return (
                  <option value={category.externalId} key={category.externalId}>
                    {category.name}
                  </option>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="IABParentCategoryExternalId">
              IAB Parent Category
            </InputLabel>
            <Select
              native
              label="IABParentCategory"
              inputProps={{
                name: 'IABParentCategoryExternalId',
                id: 'IABParentCategoryExternalId',
              }}
              {...formik.getFieldProps('IABParentCategoryExternalId')}
              error={
                !!(
                  formik.touched.IABParentCategoryExternalId &&
                  formik.errors.IABParentCategoryExternalId
                )
              }
            >
              <option aria-label="None" value="" />

              {iabCategories.map((category: IabParentCategory) => {
                return (
                  <option value={category.externalId} key={category.externalId}>
                    {category.name}
                  </option>
                );
              })}
            </Select>
          </FormControl>
          <br />
          <br />
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="IABChildCategoryExternalId">
              IAB Child Category
            </InputLabel>
            <Select
              native
              label="IABChildCategory"
              inputProps={{
                name: 'IABChildCategoryExternalId',
                id: 'IABChildCategoryExternalId',
              }}
              {...formik.getFieldProps('IABChildCategoryExternalId')}
              error={
                !!(
                  formik.touched.IABChildCategoryExternalId &&
                  formik.errors.IABChildCategoryExternalId
                )
              }
            >
              <option aria-label="None" value="" />

              {iabChildrenCategories.map((category: IabCategory) => {
                return (
                  <option value={category.externalId} key={category.externalId}>
                    {category.name}
                  </option>
                );
              })}
            </Select>
            <FormHelperText error>
              {formik.errors.IABChildCategoryExternalId
                ? formik.errors.IABChildCategoryExternalId
                : null}
            </FormHelperText>
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
