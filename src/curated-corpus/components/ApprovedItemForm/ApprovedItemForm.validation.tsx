import * as yup from 'yup';

export const validationSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Please add a title.')
    .min(2, 'Title needs to be longer than 2 characters.')
    .max(255, 'Title is too long, cannot exceed 255 characters.'),

  publisher: yup
    .string()
    .trim()
    .required('Please add a publisher.')
    .min(2, 'Publisher needs to be longer than 2 characters.')
    .max(255, 'Publisher is too long, cannot exceed 255 characters.'),

  language: yup.string().required('Please select a language.'),

  topic: yup.string().required('Please select a topic.'),

  curationStatus: yup.string().required('Please select a curation status.'),

  excerpt: yup
    .string()
    .trim()
    .required('Please add an excerpt.')
    .min(20, 'Excerpt needs to be longer than 20 characters.'),

  shortLived: yup.boolean().required(),
});
