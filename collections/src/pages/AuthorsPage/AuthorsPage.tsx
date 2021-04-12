import React from 'react';

import { AuthorCard, HandleApiResponse } from '../../components';
import { AuthorModel, useGetAuthors } from '../../api';

/**
 * Authors Page
 */
export const AuthorsPage = (): JSX.Element => {
  // Load authors
  const { loading, error, data } = useGetAuthors();

  return (
    <>
      <h1>Authors</h1>
      {!data && <HandleApiResponse loading={loading} error={error} />}

      {data &&
        data.map((author: AuthorModel) => {
          return <AuthorCard key={author?.id} author={author} />;
        })}
    </>
  );
};
