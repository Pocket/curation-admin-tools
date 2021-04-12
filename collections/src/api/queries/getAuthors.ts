import { gql } from '@apollo/client';

/**
 * Get a list of authors
 */
export const getAuthors = gql`
  query getAuthors {
    allAuthors(sortField: "createdAt", sortOrder: "DESC") {
      id
      name
      slug
      bio
      imageUrl
      active
      createdAt
      updatedAt
      Collections {
        id
      }
    }
  }
`;
