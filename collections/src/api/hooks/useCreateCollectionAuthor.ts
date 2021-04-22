import { useCreateCollectionAuthorMutation } from '../generatedTypes';

export const useCreateCollectionAuthor = () => {
  const { loading, error, data } = useCreateCollectionAuthorMutation();

  return { loading, error, data };
};
