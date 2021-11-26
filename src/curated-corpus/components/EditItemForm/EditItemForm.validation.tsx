import * as yup from 'yup';

const urlRegex = new RegExp(
  //TODO: @Herraj - remove this once I figure out the perfect regex
  // eslint-disable-next-line no-useless-escape
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
);

export const validationSchema = yup.object({
  // This is a hidden field that we pass along
  url: yup.string().required().matches(urlRegex, 'URL format is incorrect'),

  title: yup
    .string()
    .trim()
    .required('Please add a title.')
    .min(1, 'Title needs to be longer')
    .max(255, 'Title is too long'),

  publisher: yup
    .string()
    .trim()
    .required('Please add a publisher')
    .min(1, 'Publisher needs to be longer')
    .max(255, 'Publisher is too long'),

  language: yup.string().required('Please select a language'),

  topic: yup.string().required('Please select a topic'),

  corpus: yup.string().required('Please select a corpus'),

  excerpt: yup
    .string()
    .trim()
    .required('Please add an excerpt')
    .min(1, 'Publisher needs to be longer'),
});
