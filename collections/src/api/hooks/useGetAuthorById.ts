import {
  useGetAuthorByIdQuery,
  GetAuthorByIdQueryVariables,
} from '../generatedTypes';

export const useGetAuthorById = (
  variables: GetAuthorByIdQueryVariables,
  skip: boolean
) => {
  const { loading, error, data: result } = useGetAuthorByIdQuery({
    variables,
    skip,
  });

  const data = result?.allAuthors;

  return { loading, error, data };
};
