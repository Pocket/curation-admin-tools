import * as yup from 'yup';

export const validationSchema = yup.object({
  confirmRemoval: yup
    .boolean()
    .isTrue('Please confirm your intention to remove this item.'),
});
