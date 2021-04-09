import { useGetAuthorsQuery } from '../generatedTypes';

export const useGetAuthors = () => {
  const { loading, error, data } = useGetAuthorsQuery();

  return { loading, error, data };
};
