import React, { useState } from 'react';
import {
  Box,
  FormHelperText,
  Grid,
  LinearProgress,
  TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import slugify from 'slugify';
import { FormikValues, useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import {
  Button,
  FormikSelectField,
  FormikTextField,
  MarkdownPreview,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { getValidationSchema } from './CollectionForm.validation';
import { useStyles } from './CollectionForm.styles';
import { config } from '../../../config';
import {
  Collection,
  CollectionAuthor,
  CollectionLanguage,
  CollectionStatus,
  CurationCategory,
  IabCategory,
  IabParentCategory,
  Label,
} from '../../../api/generatedTypes';

interface CollectionFormProps {
  /**
   * An object with everything collection-related in it bar stories
   */
  collection: Omit<Collection, 'stories'>;

  /**
   * A list of all collection authors - for the dropdown
   */
  authors: CollectionAuthor[];

  /**
   * A list of curation categories
   */
  curationCategories: CurationCategory[];

  /**
   * A list of IAB categories
   */
  iabCategories: IabParentCategory[];

  /**
   * A list of available labels
   */
  labels: Label[];

  /**
   * A list of all supported languages
   */
  languages: CollectionLanguage[];

  /**
   * What do we do with the submitted data?
   *
   * Note: unlike most other onSubmit functions in this repository,
   * this one consumes the value for one field (labels) directly, circumventing
   * form validation.
   *
   * This is due to the fact that Formik cannot process objects as input values
   * while `labels` must be an array of objects in order for the MUI Autocomplete
   * component to work as intended.
   */
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
    labels: Label[]
  ) => void | Promise<any>;
}

/**
 * A form for adding authors or editing information for existing authors
 */
export const CollectionForm: React.FC<
  CollectionFormProps & SharedFormButtonsProps
> = (props): JSX.Element => {
  const {
    authors,
    collection,
    curationCategories,
    iabCategories,
    labels,
    languages,
    onSubmit,
    editMode = true,
    onCancel,
  } = props;

  const classes = useStyles();

  // get a list of author ids for the validation schema
  const authorIds = authors.map((author: CollectionAuthor) => {
    return author.externalId;
  });

  // if we're editing, grab the currently assigned author's external id
  const authorExternalId =
    collection.authors.length > 0 ? collection.authors[0].externalId : '';

  // pull out external ids of all the available labels in a separate variable
  const availableLabelExternalIds = labels.map((label) => label.externalId);

  // If this collection has any labels, let's keep track of them here
  // to be able to show them in the form correctly
  const [selectedLabels, setSelectedLabels] = useState<Label[]>(
    // The API, via generated types, returns a `Maybe` type (Label [] | null),
    // so type coalescing is required to keep the labels field happy.
    (collection.labels as Label[]) ?? []
  );

  // pull out external ids of all the selected labels in a separate variable
  const selectedLabelsExternalIds = selectedLabels.map(
    (label) => label.externalId
  );
  // Update labels if the user has made any changes
  const handleLabelChange = (e: React.ChangeEvent<unknown>, value: Label[]) => {
    setSelectedLabels(value);

    formik.setFieldValue('labels', value);
  };

  /**
   * Set up form validation
   */
  const formik = useFormik({
    initialValues: {
      title: collection.title ?? '',
      slug: collection.slug ?? '',
      excerpt: collection.excerpt ?? '',
      intro: collection.intro ?? '',
      labels: collection.labels ?? [],
      language: collection.language ?? CollectionLanguage.En,
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
    validationSchema: getValidationSchema(
      authorIds,
      selectedLabelsExternalIds,
      availableLabelExternalIds
    ),
    onSubmit: (values, formikHelpers) => {
      onSubmit(values, formikHelpers, selectedLabels);
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
          <FormikTextField
            id="title"
            label="Title"
            fieldProps={formik.getFieldProps('title')}
            fieldMeta={formik.getFieldMeta('title')}
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

        <Grid item xs={12} sm={6}>
          <FormikSelectField
            className={classes.marginBottom}
            id="status"
            label="Status"
            fieldProps={formik.getFieldProps('status')}
            fieldMeta={formik.getFieldMeta('status')}
            disabled={!editMode}
          >
            <option value="DRAFT">Draft</option>
            <option value="REVIEW">Review</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </FormikSelectField>
          <FormikSelectField
            className={classes.marginBottom}
            id="authorExternalId"
            label="Author"
            fieldProps={formik.getFieldProps('authorExternalId')}
            fieldMeta={formik.getFieldMeta('authorExternalId')}
          >
            <option aria-label="None" value="" />
            {authors.map((author: CollectionAuthor) => {
              return (
                <option value={author.externalId} key={author.externalId}>
                  {author.name}
                </option>
              );
            })}
          </FormikSelectField>
          <FormikSelectField
            id="language"
            label="Language Code"
            fieldProps={formik.getFieldProps('language')}
            fieldMeta={formik.getFieldMeta('language')}
          >
            {languages.map((language: CollectionLanguage) => {
              return (
                <option value={language} key={language}>
                  {language}
                </option>
              );
            })}
          </FormikSelectField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormikSelectField
            className={classes.marginBottom}
            id="curationCategoryExternalId"
            label="Curation Category"
            fieldProps={formik.getFieldProps('curationCategoryExternalId')}
            fieldMeta={formik.getFieldMeta('curationCategoryExternalId')}
          >
            <option aria-label="None" value="" />
            {curationCategories.map((category: CurationCategory) => {
              return (
                <option value={category.externalId} key={category.externalId}>
                  {category.name}
                </option>
              );
            })}
          </FormikSelectField>

          <FormikSelectField
            className={classes.marginBottom}
            id="IABParentCategoryExternalId"
            label="IAB Parent Category"
            fieldProps={formik.getFieldProps('IABParentCategoryExternalId')}
            fieldMeta={formik.getFieldMeta('IABParentCategoryExternalId')}
          >
            <option aria-label="None" value="" />
            {iabCategories.map((category: IabParentCategory) => {
              return (
                <option value={category.externalId} key={category.externalId}>
                  {category.name}
                </option>
              );
            })}
          </FormikSelectField>
          <FormikSelectField
            id="IABChildCategoryExternalId"
            label="IAB Child Category"
            fieldProps={formik.getFieldProps('IABChildCategoryExternalId')}
            fieldMeta={formik.getFieldMeta('IABChildCategoryExternalId')}
          >
            <option aria-label="None" value="" />
            {iabChildrenCategories.map((category: IabCategory) => {
              return (
                <option value={category.externalId} key={category.externalId}>
                  {category.name}
                </option>
              );
            })}
          </FormikSelectField>
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="labels"
            onChange={handleLabelChange}
            options={labels}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) =>
              option.externalId === value.externalId
            }
            value={selectedLabels}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Labels"
                placeholder="Add a label"
              />
            )}
          />
          {
            <Box mb={2}>
              {formik.errors?.labels && (
                <FormHelperText error>{formik.errors?.labels}</FormHelperText>
              )}
            </Box>
          }
        </Grid>
        <Grid item xs={12}>
          <MarkdownPreview minHeight={6.5} source={formik.values.excerpt}>
            <FormikTextField
              id="excerpt"
              label="Excerpt"
              fieldProps={formik.getFieldProps('excerpt')}
              fieldMeta={formik.getFieldMeta('excerpt')}
              multiline
              minRows={4}
            />
          </MarkdownPreview>
        </Grid>

        <Grid item xs={12}>
          <MarkdownPreview minHeight={15.5} source={formik.values.intro}>
            <FormikTextField
              id="intro"
              label="Intro"
              fieldProps={formik.getFieldProps('intro')}
              fieldMeta={formik.getFieldMeta('intro')}
              multiline
              minRows={12}
            />
          </MarkdownPreview>
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
