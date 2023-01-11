import * as yup from 'yup';

export const validationSchema = yup.object({
  labelName: yup
    .string()
    .trim()
    .required('Please add a label name.')
    .max(255, 'Label name is too long, cannot exceed 255 characters.'),
});
