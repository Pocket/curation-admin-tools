import * as yup from 'yup';

export const validationSchema = yup.object({
  moderationDetails: yup.string(),
  moderationReason: yup
    .string()
    .required('Please choose a reason for hiding this list.'),
});
