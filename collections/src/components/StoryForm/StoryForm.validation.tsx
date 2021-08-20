import * as yup from 'yup';

export const validationSchema = yup.object({
  url: yup.string().trim().required('Please enter a URL').min(12),
  title: yup.string().trim().required('Please enter a title').min(3),
  excerpt: yup.string().trim().required('Please enter an excerpt').min(12),
  authors: yup
    .string()
    .trim()
    .min(
      2, // minimum could be "AP"
      'Please enter one or more authors, separated by commas.' +
        ' Please supply at least two characters or leave this field empty' +
        ' if this story has no authors.'
    ),
  publisher: yup.string(),
  fromPartner: yup.boolean(),
});
