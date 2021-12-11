import React, { useState } from 'react';

import { FormikHelpers, FormikValues, useFormik } from 'formik';

import { validationSchema } from './ApprovedItemForm.validation';
import { ApprovedCuratedCorpusItem } from '../../api/curated-corpus-api/generatedTypes';
import {
  topics,
  languages,
  curationStatusOptions,
} from '../../helpers/definitions';
import { Grid, FormControlLabel, Switch } from '@material-ui/core';
import {
  FormikTextField,
  SharedFormButtons,
  SharedFormButtonsProps,
  ImageUpload,
  FormikSelectField,
} from '../../../_shared/components';
import { DropdownOption } from '../../helpers/definitions';

interface ApprovedItemFormProps {
  /**
   * The approved item that needs to be edited.
   */
  approvedItem: ApprovedCuratedCorpusItem;

  /**
   * On submit handle function called on the 'Save' button click
   */
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;

  onCancel: VoidFunction;

  /**
   * This function is called by the ImageUpload component after it
   * successfully uploads an image to the S3 Bucket.
   */
  onImageSave: (url: string) => void;
}

/**
 * This component houses all the logic and data that will be used in this form.
 */

export const ApprovedItemForm: React.FC<
  ApprovedItemFormProps & SharedFormButtonsProps
> = (props): JSX.Element => {
  const { approvedItem, onSubmit, onCancel, onImageSave } = props;

  // State variable to keep track of if the image for an approved item is changed
  // i.e successfully uploaded to s3
  const [isImageChanged, setIsImageChanged] = useState<boolean>(false);

  const approvedItemCorpus = curationStatusOptions.find(
    (item) => item.code === approvedItem.status
  )?.name;

  const approvedItemTopic = topics.find(
    (item) => item.code === approvedItem.topic
  )?.name;

  const approvedItemLanguage = languages.find(
    (item) => item.code.toLowerCase() === approvedItem.language
  )?.name;

  const formik = useFormik({
    initialValues: {
      url: approvedItem.url,
      title: approvedItem.title,
      publisher: approvedItem.publisher,
      language: approvedItemLanguage ?? '',
      topic: approvedItemTopic ?? '',
      curationStatus: approvedItemCorpus ?? '',
      shortLived: approvedItem.isShortLived,
      syndicated: approvedItem.isSyndicated,
      collection: approvedItem.isCollection,
      excerpt: approvedItem.excerpt,
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      onSubmit(values, formikHelpers);
    },
  });
  console.log(approvedItem.topic);
  //Boolean to disable the save button if nothing in the form has changed
  //to prevent unnecessary form submissions with the same data
  const saveDisabled = !(isImageChanged || formik.dirty);

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
          ></FormikTextField>
        </Grid>
        <Grid item xs={12}>
          <FormikTextField
            id="title"
            label="Title"
            fieldProps={formik.getFieldProps('title')}
            fieldMeta={formik.getFieldMeta('title')}
          ></FormikTextField>
        </Grid>
        <Grid item md={12} xs={12}>
          <FormikTextField
            id="publisher"
            label="Publisher"
            fieldProps={formik.getFieldProps('publisher')}
            fieldMeta={formik.getFieldMeta('publisher')}
          ></FormikTextField>
        </Grid>
        <Grid item md={12} xs={12}>
          <FormikTextField
            id="excerpt"
            label="Excerpt"
            multiline
            fieldProps={formik.getFieldProps('excerpt')}
            fieldMeta={formik.getFieldMeta('excerpt')}
          ></FormikTextField>
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="row" spacing={3}>
            <Grid item md={3}>
              <ImageUpload
                entity={approvedItem}
                onImageSave={onImageSave}
                placeholder="Upload Item Image"
                onImageChanged={setIsImageChanged}
              />
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
                            <option value={language.name} key={language.code}>
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
                            <option value={topic.name} key={topic.code}>
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
                            <option value={corpus.name} key={corpus.code}>
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
                            checked={formik.values.shortLived}
                            {...formik.getFieldProps('shortLived')}
                          />
                        }
                        label={'Short Lived'}
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
      <SharedFormButtons
        onCancel={onCancel}
        saveButtonDisabled={saveDisabled}
      />
    </form>
  );
};
