import * as yup from 'yup';

export const validationSchema = yup.object({
  restorationReason: yup
    .string()
    .required('Please enter a reason for restoring this list.'),
});
