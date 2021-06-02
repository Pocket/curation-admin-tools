import { gql } from '@apollo/client';
import { CollectionAuthorData } from './CollectionAuthorData';
/**
 * All the properties that are needed to display and edit collections
 */
export const CollectionData = gql`
  fragment CollectionData on Collection {
    externalId
    title
    slug
    excerpt
    intro
    imageUrl
    status
    authors {
      ...CollectionAuthorData
    }
  }
  ${CollectionAuthorData}
`;
