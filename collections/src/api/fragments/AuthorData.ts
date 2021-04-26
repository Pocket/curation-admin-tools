import { gql } from '@apollo/client';

/**
 * All the properties that are needed to display cards and forms with author data
 */
export const AuthorData = gql`
  fragment AuthorData on CollectionAuthor {
    externalId
    name
    slug
    bio
    imageUrl
    active
  }
`;
