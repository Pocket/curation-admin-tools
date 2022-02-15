import React from 'react';

export const PageNotFound = (): JSX.Element => {
  return (
    <>
      <h2> Oops something went wrong </h2>
      <p>
        The page you&apos;re looking for does not exist or is currently
        inaccessible
      </p>
      <a href="/"> Go back to home page </a>
    </>
  );
};
