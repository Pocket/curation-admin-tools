import React from 'react';
import { Grid, FormControlLabel, Switch } from '@material-ui/core';
import {
  FormikTextField,
  SharedFormButtons,
  SharedFormButtonsProps,
  ImageUpload,
  FormikSelectField,
} from '../../../_shared/components';
import { DropdownOption } from '../../helpers/definitions';
import { ApprovedCuratedCorpusItem } from '../../api/curated-corpus-api/generatedTypes';
import { FormikProps } from 'formik';

interface ApprovedItemFormBodyFields {
  url: string;
  title: string;
  publisher: string;
  language: string;
  topic: string;
  curationStatus: string;
  shortLived: boolean;
  syndicated: boolean;
  collection: boolean;
  excerpt: string;
}

export interface ApprovedItemFormBodyProps {
  approvedItem: ApprovedCuratedCorpusItem;
  formik: FormikProps<ApprovedItemFormBodyFields>;
  topics: DropdownOption[];
  languages: DropdownOption[];
  curationStatus: DropdownOption[];
  isSyndicated: boolean;
  isCollection: boolean;
  isShortLived: boolean;
  toggleIsShortLived: VoidFunction;
  onCancel: VoidFunction;
}

/**
 * This component is sort of a dummy component. It only displays
 * and edits data. All the logic is passed down from its parent
 * ApprovedItemForm component
 */

export const ApprovedItemFormBody: React.FC<
  ApprovedItemFormBodyProps & SharedFormButtonsProps
> = ({
  approvedItem,
  formik,
  onCancel,
  topics,
  languages,
  curationStatus,
  isCollection,
  isSyndicated,
  isShortLived,
  toggleIsShortLived,
}) => {
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
        <Grid item xs={12}>
          <Grid container direction="row" spacing={3}>
            <Grid item md={3}>
              <ImageUpload
                entity={approvedItem}
                //TODO: @Herraj - Add logic for this
                onImageSave={() => ({})}
                placeholder="Upload Item Image"
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
                        {curationStatus.map((corpus: DropdownOption) => {
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
                            checked={isShortLived}
                            {...formik.getFieldProps('isShortLived')}
                            onChange={toggleIsShortLived}
                          />
                        }
                        label={'Short Lived'}
                        labelPlacement="top"
                      />
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            disabled
                            checked={isCollection}
                            {...formik.getFieldProps('collection')}
                          />
                        }
                        label={'Collection'}
                        labelPlacement="top"
                      />
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            disabled
                            checked={isSyndicated}
                            {...formik.getFieldProps('syndicated')}
                          />
                        }
                        label={'Syndicated'}
                        labelPlacement="top"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
      </Grid>
      <SharedFormButtons onCancel={onCancel} />
    </form>
  );
};
