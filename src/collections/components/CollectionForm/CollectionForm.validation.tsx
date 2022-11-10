import * as yup from 'yup';
import {
  CollectionLanguage,
  CollectionStatus,
} from '../../../api/generatedTypes';

export const getValidationSchema = (authorIds: string[]) => {
  return yup.object({
    title: yup
      .string()
      .required('Please enter a title for this collection')
      .min(6),
    slug: yup
      .string()
      .trim()
      .required(
        'Please enter a slug or use the "Suggest slug" button to generate one from the collection title'
      )
      .matches(
        /^[a-z0-9-]+$/,
        'Slug can only contain lowercase alphanumeric characters and hyphens'
      )
      .min(6),
    excerpt: yup.string(),
    intro: yup.string(),
    language: yup
      .mixed<CollectionLanguage>()
      .oneOf(Object.values(CollectionLanguage))
      .required('Please choose a language'),
    status: yup
      .mixed<CollectionStatus>()
      .oneOf(Object.values(CollectionStatus))
      .required(),
    authorExternalId: yup
      .string()
      .oneOf(authorIds)
      .required('Please choose an author'),
    curationCategoryExternalId: yup.string(),
    IABParentCategoryExternalId: yup.string(),
    // If an IAB parent category is chosen, require the IAB child category
    // to be filled in as well.
    IABChildCategoryExternalId: yup
      .string()
      .when('IABParentCategoryExternalId', {
        is: (value: string) => value && value.length > 0,
        then: yup
          .string()
          .required(
            'Please choose a child IAB category or leave both IAB categories blank'
          ),
        otherwise: yup.string(),
      }),
  });
};
