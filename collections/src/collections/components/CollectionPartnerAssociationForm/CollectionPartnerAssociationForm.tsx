import React from 'react';
import { Grid, LinearProgress } from '@material-ui/core';
import { FormikValues, useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import {
  FormikSelectField,
  FormikTextField,
  MarkdownPreview,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import {
  CollectionPartner,
  CollectionPartnerAssociation,
} from '../../api/collection-api/generatedTypes';
import { getValidationSchema } from './CollectionPartnerAssociationForm.validation';

interface AssociationFormProps {
  /**
   * An object with everything partner-related in it.
   */
  association: CollectionPartnerAssociation;

  /**
   * What do we do with the submitted data?
   */
  onSubmit: (values: FormikValues, formikHelpers: FormikHelpers<any>) => void;

  /**
   * A list of partners for the dropdown
   */
  partners: CollectionPartner[];
}

/**
 * A form for adding a collection-partner association or editing data
 * for an existing one.
 */
export const CollectionPartnerAssociationForm: React.FC<
  AssociationFormProps & SharedFormButtonsProps
> = (props): JSX.Element => {
  const { association, partners, onSubmit, editMode, onCancel } = props;

  // get a list of partner ids for the validation schema
  const partnerIds = partners.map((partner: CollectionPartner) => {
    return partner.externalId;
  });

  // if we're editing, grab the currently assigned partner's external id,
  // otherwise use the first id from the partners array as the default value
  const partnerExternalId =
    association.partner.externalId.length > 0
      ? association.partner.externalId
      : partnerIds[0];

  /**
   * Set up form validation
   */
  const formik = useFormik({
    initialValues: {
      partnerExternalId,
      type: association.type,
      name: association.name ?? '',
      url: association.url ?? '',
      blurb: association.blurb ?? '',
    },
    // We don't want to irritate users by displaying validation errors
    // before they actually submit the form
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: getValidationSchema(partnerIds),
    onSubmit: (values, formikHelpers) => {
      onSubmit(values, formikHelpers);
    },
  });

  const types = ['PARTNERED', 'SPONSORED'];

  return (
    <form
      name="collection-partner-association-form"
      onSubmit={formik.handleSubmit}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormikSelectField
            id="type"
            label="Type"
            fieldProps={formik.getFieldProps('type')}
            fieldMeta={formik.getFieldMeta('type')}
          >
            {types.map((type) => {
              return (
                <option value={type} key={type}>
                  {type}
                </option>
              );
            })}
          </FormikSelectField>
        </Grid>

        <Grid item xs={12}>
          <FormikSelectField
            id="partnerExternalId"
            label="Partner"
            fieldProps={formik.getFieldProps('partnerExternalId')}
            fieldMeta={formik.getFieldMeta('partnerExternalId')}
          >
            {partners.map((partner: CollectionPartner) => {
              return (
                <option value={partner.externalId} key={partner.externalId}>
                  {partner.name}
                </option>
              );
            })}
          </FormikSelectField>
        </Grid>

        <Grid item xs={12}>
          <h3>Optional Overrides</h3>
        </Grid>

        <Grid item xs={12}>
          <FormikTextField
            id="name"
            label="Name"
            fieldProps={formik.getFieldProps('name')}
            fieldMeta={formik.getFieldMeta('name')}
            placeholder={association.partner.name}
          />
        </Grid>

        <Grid item xs={12}>
          <FormikTextField
            id="url"
            label="URL"
            fieldProps={formik.getFieldProps('url')}
            fieldMeta={formik.getFieldMeta('url')}
            placeholder={association.partner.url}
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
              rows={12}
              placeholder={association.partner.blurb}
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
