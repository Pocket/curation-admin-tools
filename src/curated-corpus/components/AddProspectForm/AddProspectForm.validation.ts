import * as yup from 'yup';

export const validationSchema = yup.object({
  itemUrl: yup
    .string()
    .url('Please enter a valid URL starting with https://')
    .required('Please add an item URL.'),
});
