import * as yup from 'yup';
import { CollectionStatus } from '../../../api/generatedTypes';

export const validationSchema = yup.object({
  title: yup.string().min(3),
  author: yup.string().min(3),
  labels: yup.array(),
  status: yup.mixed<CollectionStatus>().oneOf(Object.values(CollectionStatus)),
  filterRequired: yup.bool().when(['title', 'author', 'status', 'labels'], {
    is: (title: any, author: any, status: any, labels: any) =>
      !title && !author && !status && labels.length < 1,
    then: yup.bool().required('At least one filter is required.'),
    otherwise: yup.bool(),
  }),
});
