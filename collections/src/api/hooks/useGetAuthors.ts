import { useGetAuthorsQuery } from '../generatedTypes';

export const useGetAuthors = () => {
  const { loading, error, data: result } = useGetAuthorsQuery();

  const data = result?.allAuthors;

  return { loading, error, data };
};
