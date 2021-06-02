import { gql } from '@apollo/client';
import { CollectionAuthorData } from '../fragments/CollectionAuthorData';

/**
 * Update a collection author's image url
 */
export const updateCollectionStoryImageUrl = gql`
  mutation updateCollectionAuthorImageUrl(
    $externalId: String!
    $imageUrl: Url!
  ) {
    updateCollectionAuthorImageUrl(
      data: { externalId: $externalId, imageUrl: $imageUrl }
    ) {
      ...CollectionAuthorData
    }
  }
  ${CollectionAuthorData}
`;
