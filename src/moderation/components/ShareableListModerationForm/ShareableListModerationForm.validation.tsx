import * as yup from 'yup';

export const validationSchema = yup.object({
  moderationStatus: yup
    .string()
    .oneOf(['HIDDEN', null], 'Cannot make list VISIBLE yet.'),
  moderationDetails: yup.string(),
  moderationReason: yup.string().required('Please choose an option.'),
});
