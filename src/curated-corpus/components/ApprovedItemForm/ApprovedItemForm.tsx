import React, { useEffect, useState } from 'react';
import {
  Box,
  FormControlLabel,
  FormHelperText,
  Grid,
  LinearProgress,
  Link,
  styled,
  Switch,
  TextField,
  Tooltip,
} from '@mui/material';
import { FormikHelpers, FormikValues, useFormik } from 'formik';
import { validationSchema } from './ApprovedItemForm.validation';
import {
  ApprovedCorpusItem,
  CuratedStatus,
  useGetOpenGraphFieldsQuery,
  useGetUrlMetadataLazyQuery,
} from '../../../api/generatedTypes';
import {
  ApprovedItemFromProspect,
  curationStatusOptions,
  DropdownOption,
  languages,
  topics,
} from '../../helpers/definitions';
import {
  Button,
  FormikSelectField,
  FormikTextField,
  ImageUpload,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';
import { applyCurlyQuotes } from '../../../_shared/utils/applyCurlyQuotes';
import { applyApTitleCase } from '../../../_shared/utils/applyApTitleCase';
import { curationPalette } from '../../../theme';

interface ApprovedItemFormProps {
  /**
   * The approved item that needs to be edited.
   */
  approvedItem: ApprovedCorpusItem | ApprovedItemFromProspect;

  /**
   * On submit handle function called on the 'Save' button click
   */
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ) => void | Promise<any>;

  /**
   * On Cancel function closes the form / modal
   */
  onCancel: VoidFunction;

  /**
   * Optional prop to set curation status as Recommendation
   */
  isRecommendation?: boolean;

  /**
   * This function is called by the ImageUpload component after it
   * successfully uploads an image to the S3 Bucket.
   */
  onImageSave?: (url: string) => void;
}

/**
 * This component houses all the logic and data that will be used in this form.
 */

export const ApprovedItemForm: React.FC<
  ApprovedItemFormProps & SharedFormButtonsProps
> = (props): JSX.Element => {
  const {
    approvedItem,
    isRecommendation,
    onSubmit,
    onCancel,
    onImageSave: onImageSaveFromParent,
  } = props;

  const formik = useFormik({
    initialValues: {
      url: approvedItem.url,
      title: approvedItem.title,
      authors: flattenAuthors(approvedItem.authors),
      publisher: approvedItem.publisher,
      // A read-only value we may get back from the Pocket Graph
      // for some stories + all collections and syndicated items.
      datePublished: approvedItem.datePublished ?? null,
      language: approvedItem.language ?? '',
      topic: approvedItem.topic ?? '',
      curationStatus: isRecommendation
        ? CuratedStatus.Recommendation
        : approvedItem.status ?? '',
      timeSensitive: approvedItem.isTimeSensitive,
      syndicated: approvedItem.isSyndicated,
      collection: approvedItem.isCollection,
      excerpt: approvedItem.excerpt,
      imageUrl: approvedItem.imageUrl,
      source: approvedItem.source,
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      onSubmit(values, formikHelpers);
    },
  });

  // This function calls the onImageSave function sent as a prop from the
  // direct parent and then updates the imageUrl field in the form to pass the form validation
  const onImageSave = (url: string) => {
    onImageSaveFromParent && onImageSaveFromParent(url);
    formik.setFieldValue('imageUrl', url);
  };

  // state variable to store and set Open Graph excerpt fetched by the query
  const [ogExcerpt, setOgExcerpt] = useState<string>('');

  // state variable to store and set parser excerpt fetched by the query
  const [parserExcerpt, setParserExcerpt] = useState<string>('');

  // state variable to keep track if the fetched og excerpt and parser excerpts match
  const [hasSameParserAndOGExcerpt, setHasSameParserAndOGExcerpt] =
    useState(false);

  /**
   * Query to fetch the Parser excerpt for this approved item. Checks the cache first before making a request.
   * This is called after the OG excerpt fetch request is completed. When completed, compares the two excerpts
   * and sets hasSameParserAndOGExcerpt state.
   */
  const [fetchAndSetParserExcerpt] = useGetUrlMetadataLazyQuery({
    variables: { url: approvedItem.url },
    fetchPolicy: 'cache-first',
    onCompleted: ({ getUrlMetadata }) => {
      const parserExcerpt = getUrlMetadata.excerpt;
      setParserExcerpt(parserExcerpt || '');

      if (parserExcerpt === ogExcerpt) {
        setHasSameParserAndOGExcerpt(true);
      }
    },
  });

  /**
   * This calls the query on component mount. This isn't ideal because the editors might not even want the OG excerpt so we
   * are making an unnecessary fetch request. However, this doesn't impact the UX (render performance) right now
   * but should be refactored whenever possible. Calls the parser query on complete only if the current item's excerpt is the
   * same as the fetched og excerpt.
   */
  useGetOpenGraphFieldsQuery({
    variables: { url: approvedItem.url },
    fetchPolicy: 'cache-first',
    onCompleted: ({ getOpenGraphFields }) => {
      const ogExcerpt = getOpenGraphFields?.description;

      ogExcerpt && setOgExcerpt(ogExcerpt);

      if (ogExcerpt === approvedItem.excerpt) {
        fetchAndSetParserExcerpt();
      }
    },
  });

  /**
   * Using this hook to clean up the state variables on component unmount
   */
  useEffect(() => {
    return () => {
      setOgExcerpt('');
      setParserExcerpt('');
      setHasSameParserAndOGExcerpt(false);
    };
  }, [approvedItem.url]);

  const fixTitle = () => {
    formik.setFieldValue(
      'title',
      applyCurlyQuotes(applyApTitleCase(formik.values.title)),
    );
  };

  const fixExcerpt = () => {
    formik.setFieldValue('excerpt', applyCurlyQuotes(formik.values.excerpt));
  };

  // Boolean. Set to true if the current excerpt in the form excerpt input field is the og excerpt.
  const isViewingOGExcerpt = formik.getFieldMeta('excerpt').value === ogExcerpt;

  // Gets the toggle link text
  const getExcerptToggleText = (): string => {
    if (hasSameParserAndOGExcerpt) {
      return 'Parser excerpt matches OG excerpt';
    }

    return isViewingOGExcerpt ? 'Use Parser Excerpt' : 'Use Open Graph Excerpt';
  };

  const toggleParserAndOGExcerpt = () => {
    isViewingOGExcerpt
      ? formik.setFieldValue('excerpt', parserExcerpt || approvedItem.excerpt)
      : formik.setFieldValue('excerpt', ogExcerpt);
  };

  const getExcerptToolTipText = () => {
    return isViewingOGExcerpt
      ? parserExcerpt || approvedItem.excerpt
      : ogExcerpt;
  };

  const StyledExcerptToggleLink = styled(Link)({
    verticalAlign: 'middle',
    textDecoration: 'none',
    cursor: 'pointer',
    color: hasSameParserAndOGExcerpt
      ? curationPalette.neutral
      : curationPalette.primary,
    pointerEvents: hasSameParserAndOGExcerpt ? 'none' : 'auto',
  });

  return (
    <form name="approved-item-edit-form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormikTextField
            id="url"
            label="Item URL"
            fieldProps={formik.getFieldProps('url')}
            fieldMeta={formik.getFieldMeta('url')}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex">
            <Box flexGrow={1} alignSelf="center" textOverflow="ellipsis">
              <FormikTextField
                id="title"
                label="Title"
                fieldProps={formik.getFieldProps('title')}
                fieldMeta={formik.getFieldMeta('title')}
              />
            </Box>
            <Box alignSelf="baseline" ml={1}>
              <Button buttonType="hollow" onClick={fixTitle}>
                Fix title
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item md={12} xs={12}>
          <FormikTextField
            id="authors"
            label="Authors"
            fieldProps={formik.getFieldProps('authors')}
            fieldMeta={formik.getFieldMeta('authors')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <FormikTextField
            id="publisher"
            label="Publisher"
            fieldProps={formik.getFieldProps('publisher')}
            fieldMeta={formik.getFieldMeta('publisher')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <FormikTextField
            id="excerpt"
            label="Excerpt"
            multiline
            fieldProps={formik.getFieldProps('excerpt')}
            fieldMeta={formik.getFieldMeta('excerpt')}
          />
        </Grid>

        <Grid
          container
          item
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          columnSpacing={3}
        >
          <Grid item>
            <Button buttonType="hollow" onClick={fixExcerpt}>
              Fix Quotes
            </Button>
          </Grid>
          <Grid item>
            <Tooltip title={getExcerptToolTipText()} arrow>
              <StyledExcerptToggleLink onClick={toggleParserAndOGExcerpt}>
                {getExcerptToggleText()}
              </StyledExcerptToggleLink>
            </Tooltip>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container direction="row" spacing={3}>
            <Grid item md={3}>
              <ImageUpload
                entity={approvedItem}
                onImageSave={onImageSave}
                placeholder="/placeholders/story.svg"
              />

              <FormikTextField
                id="imageUrl"
                label="imageUrl"
                style={{ visibility: 'hidden' }}
                fieldProps={formik.getFieldProps('imageUrl')}
                fieldMeta={formik.getFieldMeta('imageUrl')}
              />

              <FormHelperText error>
                {formik.getFieldMeta('imageUrl').error
                  ? formik.getFieldMeta('imageUrl').error
                  : null}
              </FormHelperText>
            </Grid>
            <Grid item md={9}>
              <Grid container spacing={3}>
                <Grid item md={12}>
                  <Grid container direction="row" spacing={3}>
                    <Grid item md={4} xs={12}>
                      <FormikSelectField
                        id="language"
                        label="Language"
                        fieldProps={formik.getFieldProps('language')}
                        fieldMeta={formik.getFieldMeta('language')}
                      >
                        <option aria-label="None" />
                        {languages.map((language: DropdownOption) => {
                          return (
                            <option value={language.code} key={language.code}>
                              {language.name}
                            </option>
                          );
                        })}
                      </FormikSelectField>
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <FormikSelectField
                        id="topic"
                        label="Topic"
                        fieldProps={formik.getFieldProps('topic')}
                        fieldMeta={formik.getFieldMeta('topic')}
                      >
                        <option aria-label="None" value="" />
                        {topics.map((topic: DropdownOption) => {
                          return (
                            <option value={topic.code} key={topic.code}>
                              {topic.name}
                            </option>
                          );
                        })}
                      </FormikSelectField>
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <FormikSelectField
                        id="curationStatus"
                        label="Curation Status"
                        fieldProps={formik.getFieldProps('curationStatus')}
                        fieldMeta={formik.getFieldMeta('curationStatus')}
                      >
                        <option aria-label="None" value="" />
                        {curationStatusOptions.map((corpus: DropdownOption) => {
                          return (
                            <option value={corpus.code} key={corpus.code}>
                              {corpus.name}
                            </option>
                          );
                        })}
                      </FormikSelectField>
                    </Grid>
                  </Grid>
                  <Grid container direction="row" spacing={3}>
                    <Grid item md={4} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            color="primary"
                            checked={formik.values.timeSensitive}
                            {...formik.getFieldProps('timeSensitive')}
                          />
                        }
                        label={'Time Sensitive'}
                        labelPlacement="end"
                      />
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            disabled
                            checked={formik.values.collection}
                            {...formik.getFieldProps('collection')}
                          />
                        }
                        label={'Collection'}
                        labelPlacement="end"
                      />
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            disabled
                            checked={formik.values.syndicated}
                            {...formik.getFieldProps('syndicated')}
                          />
                        }
                        label={'Syndicated'}
                        labelPlacement="end"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box display="none">
        <TextField
          type="hidden"
          id="source"
          label="source"
          {...formik.getFieldProps('source')}
        />
        <TextField
          type="hidden"
          id="datePublished"
          label="datePublished"
          {...formik.getFieldProps('datePublished')}
        />
      </Box>

      {formik.isSubmitting && (
        <Grid item xs={12}>
          <Box mb={3}>
            <LinearProgress />
          </Box>
        </Grid>
      )}

      <SharedFormButtons onCancel={onCancel} />
    </form>
  );
};
