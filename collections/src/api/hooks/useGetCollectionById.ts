import {
  useGetCollectionByIdQuery,
  GetCollectionByIdQueryVariables,
} from '../generatedTypes';

export const useGetCollectionById = (
  variables: GetCollectionByIdQueryVariables,
  skip: boolean
) => {
  const { loading, error, data } = useGetCollectionByIdQuery({
    variables,
    skip,
  });

  return { loading, error, data };
};
