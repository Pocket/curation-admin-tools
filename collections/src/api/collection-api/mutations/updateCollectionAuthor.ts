import { gql } from '@apollo/client';
import { CollectionAuthorData } from '../fragments/CollectionAuthorData';

/**
 * Update an author
 */
export const updateCollectionAuthor = gql`
  mutation updateCollectionAuthor(
    $externalId: String!
    $name: String!
    $slug: String!
    $bio: Markdown
    $imageUrl: Url
    $active: Boolean
  ) {
    updateCollectionAuthor(
      data: {
        externalId: $externalId
        name: $name
        slug: $slug
        bio: $bio
        imageUrl: $imageUrl
        active: $active
      }
    ) {
      ...CollectionAuthorData
    }
  }
  ${CollectionAuthorData}
`;
