import { gql } from '@apollo/client';
import { ImageData } from './ImageData';

/**
 * All the properties that are needed to display cards and forms with author data
 */
export const CollectionAuthorData = gql`
  fragment CollectionAuthorData on CollectionAuthor {
    externalId
    name
    slug
    bio
    image {
      ...ImageData
    }
    imageUrl
    active
  }
  ${ImageData}
`;
