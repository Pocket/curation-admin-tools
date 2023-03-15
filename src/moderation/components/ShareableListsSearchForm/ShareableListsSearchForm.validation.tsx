import * as yup from 'yup';

export const validationSchema = yup.object({
  listExternalId: yup.string(),
});
