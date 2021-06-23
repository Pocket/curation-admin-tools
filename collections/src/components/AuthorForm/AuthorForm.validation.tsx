import * as yup from 'yup';

/**
 * Validation schema for the Author add/edit form
 */
export const validationSchema = yup.object({
  name: yup
    .string()
    .required('Please enter the full name of the author')
    .min(6),
  slug: yup
    .string()
    .trim()
    .required(
      'Please enter a slug or use the "Suggest slug" button to generate one from the name of the author'
    )
    .matches(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase alphanumeric characters and hyphens'
    )
    .min(6),
  bio: yup.string(),
  active: yup.boolean().required(),
});
