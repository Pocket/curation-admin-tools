import React from 'react';
import { Grid, LinearProgress } from '@material-ui/core';
import { FormikValues, useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import {
  FormikTextField,
  MarkdownPreview,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { validationSchema } from './PartnerForm.validation';
import { CollectionPartner } from '../../../api/generatedTypes';

interface PartnerFormProps {
  /**
   * An object with everything partner-related in it.
   */
  partner: CollectionPartner;

  /**
   * What do we do with the submitted data?
   */
  onSubmit: (values: FormikValues, formikHelpers: FormikHelpers<any>) => void;
}

/**
 * A form for adding authors or editing information for existing authors
 */
export const PartnerForm: React.FC<
  PartnerFormProps & SharedFormButtonsProps
> = (props): JSX.Element => {
  const { partner, onSubmit, editMode, onCancel } = props;

  /**
   * Set up form validation
   */
  const formik = useFormik({
    initialValues: {
      name: partner.name ?? '',
      url: partner.url ?? '',
      blurb: partner.blurb ?? '',
    },
    // We don't want to irritate users by displaying validation errors
    // before they actually submit the form
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      onSubmit(values, formikHelpers);
    },
  });

  return (
    <form name="partner-form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormikTextField
            id="name"
            label="Name"
            fieldProps={formik.getFieldProps('name')}
            fieldMeta={formik.getFieldMeta('name')}
          />
        </Grid>

        <Grid item xs={12}>
          <FormikTextField
            id="url"
            label="URL"
            fieldProps={formik.getFieldProps('url')}
            fieldMeta={formik.getFieldMeta('url')}
          />
        </Grid>

        <Grid item xs={12}>
          <MarkdownPreview minHeight={15.5} source={formik.values.blurb}>
            <FormikTextField
              id="blurb"
              label="Blurb"
              fieldProps={formik.getFieldProps('blurb')}
              fieldMeta={formik.getFieldMeta('blurb')}
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
