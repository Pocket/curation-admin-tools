import * as yup from 'yup';

export const validationSchema = yup.object({
  labelName: yup
    .string()
    .trim()
    .required('Please add a label name.')
    .matches(
      /^[a-z0-9-]+$/,
      'Label name can only contain lowercase alphanumeric characters and hyphens.'
    )
    .min(2, 'Label name needs to be at least 2 characters.')
    .max(255, 'Label name is too long, cannot exceed 255 characters.'),
});
