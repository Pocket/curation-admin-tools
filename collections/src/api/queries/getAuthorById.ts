import { gql } from '@apollo/client';

/**
 * Get author information by their external id.
 */
export const getAuthorById = gql`
  query getAuthorById($id: String!) {
    allAuthors(filter: { externalId: $id }) {
      externalId
      name
      slug
      bio
      imageUrl
      active
      createdAt
      updatedAt
      Collections {
        externalId
      }
    }
  }
`;
