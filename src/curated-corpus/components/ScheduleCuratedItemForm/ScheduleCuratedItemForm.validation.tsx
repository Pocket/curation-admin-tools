import * as yup from 'yup';

export const validationSchema = yup.object({
  // This should be strictly limited to the list of new tab feeds we have
  newTabFeedExternalId: yup.string().trim().required(),

  // The options on the date picker are limited to today + up to 60 days into the future
  // TODO: Still need to validate it here
  scheduledDate: yup.string().required(),
});
