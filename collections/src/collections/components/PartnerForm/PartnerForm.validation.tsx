import * as yup from 'yup';

/**
 * Validation schema for the Partner add/edit form
 */
export const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Please enter the name of the partner company')
    .min(2, 'Please enter at least two characters'),
  url: yup
    .string()
    .trim()
    .required('Please enter a URL')
    .min(12, 'URL must be at least 12 characters long'),
  blurb: yup
    .string()
    .trim()
    .required('Please enter the blurb for the partner company'),
});
