import React, { useState } from 'react';

import { FormikHelpers, FormikValues, useFormik } from 'formik';

import { validationSchema } from './ProspectItemForm.validation';
import { Prospect } from '../../api/prospect-api/generatedTypes';
import { topics, languages } from '../../helpers/definitions';
import { Grid, FormControlLabel, Switch } from '@material-ui/core';
import {
  FormikTextField,
  SharedFormButtons,
  SharedFormButtonsProps,
  ImageUpload,
  FormikSelectField,
} from '../../../_shared/components';
import { DropdownOption } from '../../helpers/definitions';

interface ProspectItemFormProps {
  /**
   * The approved item that needs to be edited.
   */
  prospectItem: Prospect;

  isRecommendation: boolean;
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

export const ProspectItemForm: React.FC<
  ProspectItemFormProps & SharedFormButtonsProps
> = (props): JSX.Element => {
  const { prospectItem, isRecommendation, onSubmit, onCancel, onImageSave } =
    props;

  // State variable to keep track of if the image for an approved item is changed
  // i.e successfully uploaded to s3
  const [isImageChanged, setIsImageChanged] = useState<boolean>(false);

  const prospectStatus = isRecommendation ? 'Recommendation' : 'Corpus';

  const prospectItemTopic = topics.find(
    (item) => item.code === prospectItem.topic
  )?.name;

  const prospectItemLanguage = languages.find(
    (item) => item.code.toLowerCase() === prospectItem.language
  )?.name;

  const formik = useFormik({
    initialValues: {
      url: prospectItem.url,
      title: prospectItem.title,
      publisher: prospectItem.publisher,
      language: prospectItemLanguage ?? '',
      topic: prospectItemTopic ?? '',
      curationStatus: prospectStatus,
      shortLived: false,
      syndicated: prospectItem.isSyndicated ?? false,
      collection: prospectItem.isCollection ?? false,
      excerpt: prospectItem.excerpt,
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      onSubmit(values, formikHelpers);
    },
  });

  //Boolean to disable the save button if the prospect has no imageUrl and
  //no new image has been uploaded by the user.
  // saveDisabled will be false (save button enabled) when either there's a imageUrl or user uploaded new image
  const saveDisabled = !(prospectItem.imageUrl || isImageChanged);

  return (
    <form name="prospect-item-edit-form" onSubmit={formik.handleSubmit}>
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
                entity={prospectItem}
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
                        disabled
                      >
                        <option value={prospectStatus}>{prospectStatus}</option>
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
                            checked={formik.values.collection}
                            {...formik.getFieldProps('collection')}
                          />
                        }
                        label={'Collection'}
                        labelPlacement="end"
                        disabled
                      />
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formik.values.syndicated}
                            {...formik.getFieldProps('syndicated')}
                          />
                        }
                        label={'Syndicated'}
                        labelPlacement="end"
                        disabled
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
