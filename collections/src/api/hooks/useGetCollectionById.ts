import {
  useGetCollectionByIdQuery,
  GetCollectionByIdQueryVariables,
} from '../generatedTypes';

export const useGetCollectionById = (
  variables: GetCollectionByIdQueryVariables,
  skip: boolean
) => {
  const { loading, error, data: result } = useGetCollectionByIdQuery({
    variables,
    skip,
  });

  const data = result?.allCollections;

  return { loading, error, data };
};
