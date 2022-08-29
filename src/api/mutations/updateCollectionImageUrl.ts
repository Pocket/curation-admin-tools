import { gql } from '@apollo/client';
import { CollectionData } from '../fragments/CollectionData';

/**
 * Update a collection's image url
 */
export const updateCollectionImageUrl = gql`
  mutation updateCollectionImageUrl(
    $externalId: String!
    $imageUrl: Url!
    $imageOptions: [CachedImageInput!]!
  ) {
    updateCollectionImageUrl(
      data: { externalId: $externalId, imageUrl: $imageUrl }
    ) {
      ...CollectionData
    }
  }
  ${CollectionData}
`;
