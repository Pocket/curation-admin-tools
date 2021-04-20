import { useGetDraftCollectionsQuery } from '../generatedTypes';

export const useGetDraftCollections = () => {
  const { loading, error, data } = useGetDraftCollectionsQuery();

  return { loading, error, data };
};
