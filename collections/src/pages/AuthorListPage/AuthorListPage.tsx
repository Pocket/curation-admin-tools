import React from 'react';

import { AuthorListCard, HandleApiResponse } from '../../components';
import { AuthorModel, useGetAuthors } from '../../api';

/**
 * Author List Page
 */
export const AuthorListPage = (): JSX.Element => {
  // Load authors
  const { loading, error, data } = useGetAuthors();

  return (
    <>
      <h1>Authors</h1>
      {!data && <HandleApiResponse loading={loading} error={error} />}

      {data &&
        data.map((author: AuthorModel | null) => {
          return author && <AuthorListCard key={author.id} author={author} />;
        })}
    </>
  );
};
