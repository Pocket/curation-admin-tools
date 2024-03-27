import * as yup from 'yup';

export const validationSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Please add a title.')
    .min(2, 'Title needs to be longer than 2 characters.')
    .max(255, 'Title is too long, cannot exceed 255 characters.'),

  authors: yup
    .string()
    .trim()
    .required(
      'Please add an author. If this item has multiple authors, please use commas to separate them.'
    )
    .min(2, 'Authors field needs to be longer than 2 characters.')
    .max(
      255,
      'Value for authors field is too long, it cannot exceed 255 characters.'
    ),

  publisher: yup
    .string()
    .trim()
    .required('Please add a publisher.')
    .min(2, 'Publisher needs to be longer than 2 characters.')
    .max(255, 'Publisher is too long, cannot exceed 255 characters.'),

  // This value may not be present in initial curated corpus data,
  // so it's not a required field.
  datePublished: yup.date().nullable().default(null),

  language: yup.string().required('Please select a language.'),

  topic: yup.string().required('Please select a topic.'),

  curationStatus: yup.string().required('Please select a curation status.'),

  excerpt: yup
    .string()
    .trim()
    .required('Please add an excerpt.')
    .min(20, 'Excerpt needs to be longer than 20 characters.'),

  timeSensitive: yup.boolean().required(),

  imageUrl: yup.string().required('Please upload an image'),
});
