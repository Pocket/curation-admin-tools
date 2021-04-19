import { useGetCollectionsQuery } from '../generatedTypes';

export const useGetCollections = () => {
  const { loading, error, data: result } = useGetCollectionsQuery();

  const data = result?.allCollections;

  return { loading, error, data };
};
