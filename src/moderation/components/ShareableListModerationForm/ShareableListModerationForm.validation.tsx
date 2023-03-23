import * as yup from 'yup';

export const validationSchema = yup.object({
  moderationReason: yup
    .string()
    .trim()
    .required('Please add a moderation reason.')
    .min(3, 'moderation reason needs to be at least 3 characters.'),
});
