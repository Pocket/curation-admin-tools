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

interface EditItemFormBodyFields {
  url: string;
  title: string;
  publisher: string;
  language: string;
  topic: string;
  corpus: string;
  shortLived: boolean;
  excerpt: string;
}

export interface EditItemFormBodyProps {
  approvedItem: ApprovedCuratedCorpusItem;
  formik: FormikProps<EditItemFormBodyFields>;
  topics: DropdownOption[];
  languages: DropdownOption[];
  corpuses: DropdownOption[];
  isShortLived: boolean;
  toggleIsShortLived: VoidFunction;
  onCancel: VoidFunction;
}

/**
 * This component is sort of a dummy component. It only displays
 * and edits data. All the logic is passed down from its parent
 * EditItemForm component
 */

export const EditItemFormBody: React.FC<
  EditItemFormBodyProps & SharedFormButtonsProps
> = ({
  approvedItem,
  formik,
  onCancel,
  topics,
  languages,
  corpuses,
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
                <Grid item md={12} xs={12}>
                  <FormikTextField
                    id="publisher"
                    label="Publisher"
                    fieldProps={formik.getFieldProps('publisher')}
                    fieldMeta={formik.getFieldMeta('publisher')}
                  ></FormikTextField>
                </Grid>
                <Grid item md={12}>
                  <Grid container direction="row" spacing={3}>
                    <Grid item md={3} xs={12}>
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
                    <Grid item md={3} xs={12}>
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
                    <Grid item md={3} xs={12}>
                      <FormikSelectField
                        id="corpus"
                        label="Corpus"
                        fieldProps={formik.getFieldProps('corpus')}
                        fieldMeta={formik.getFieldMeta('corpus')}
                      >
                        <option aria-label="None" value="" />
                        {corpuses.map((corpus: DropdownOption) => {
                          return (
                            <option value={corpus.name} key={corpus.code}>
                              {corpus.name}
                            </option>
                          );
                        })}
                      </FormikSelectField>
                    </Grid>
                    <Grid item md={3} xs={12}>
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
                        labelPlacement="end"
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
            fieldProps={formik.getFieldProps('excerpt')}
            fieldMeta={formik.getFieldMeta('excerpt')}
          ></FormikTextField>
        </Grid>
      </Grid>
      <SharedFormButtons onCancel={onCancel} />
    </form>
  );
};
