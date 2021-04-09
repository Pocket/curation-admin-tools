import React from 'react';

import { useGetAuthors } from '../../api';
/**
 * Authors Page
 */
export const AuthorsPage = (): JSX.Element => {
  // Load authors
  const { loading, error, data } = useGetAuthors();

  return <h1>Hello Authors!</h1>;
};
