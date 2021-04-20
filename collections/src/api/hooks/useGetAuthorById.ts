import {
  useGetAuthorByIdQuery,
  GetAuthorByIdQueryVariables,
} from '../generatedTypes';

export const useGetAuthorById = (
  variables: GetAuthorByIdQueryVariables,
  skip: boolean
) => {
  const { loading, error, data } = useGetAuthorByIdQuery({
    variables,
    skip,
  });

  return { loading, error, data };
};
