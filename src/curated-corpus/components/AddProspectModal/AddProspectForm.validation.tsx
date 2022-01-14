import * as yup from 'yup';

export const validationSchema = yup.object({
  itemUrl: yup
    .string()
    .url('URL format invalid')
    .required('Please add an URL.'),
});
