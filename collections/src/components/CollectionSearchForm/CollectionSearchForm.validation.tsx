import * as yup from 'yup';
import { CollectionStatus } from '../../api/collection-api';

export const validationSchema = yup.object({
  title: yup.string().min(3),
  author: yup.string().min(3),
  status: yup.mixed<CollectionStatus>().oneOf(Object.values(CollectionStatus)),
  filterRequired: yup.bool().when(['title', 'author', 'status'], {
    is: (title: any, author: any, status: any) => !title && !author && !status,
    then: yup.bool().required('at least one filter is required'),
    otherwise: yup.bool(),
  }),
});
