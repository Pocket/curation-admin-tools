import * as yup from 'yup';
import { CollectionPartnershipType } from '../../api/collection-api/generatedTypes';

/**
 * Validation schema for the CollectionPartnerAssociation add/edit form
 */
export const getValidationSchema = (partnerIds: string[]) => {
  return yup.object({
    partnerExternalId: yup.string().required().oneOf(partnerIds),
    type: yup
      .string()
      .required()
      .oneOf([
        CollectionPartnershipType.Partnered,
        CollectionPartnershipType.Sponsored,
      ]),
    name: yup
      .string()
      .trim()
      // This is more a sanity check than anything else - wouldn't want anyone to
      // accidentally type something in this or the below fields and submit it
      // without noticing. 'Name', 'URL', and 'Blurb' fields are optional, but if
      // specified, will override the default Partner information so it's important
      // they're checked.
      .min(2, 'Please enter at least two characters or leave this field blank'),
    url: yup
      .string()
      .trim()
      .min(10, 'Please enter at least 10 characters or leave this field blank'),
    blurb: yup
      .string()
      .trim()
      .min(10, 'Please enter at least 10 characters or leave this field blank'),
  });
};
