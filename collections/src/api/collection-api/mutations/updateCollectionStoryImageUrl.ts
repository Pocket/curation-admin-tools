import { gql } from '@apollo/client';
import { CollectionStoryData } from '../fragments/CollectionStoryData';

/**
 * Update a collection story's image url
 */
export const updateCollectionStoryImageUrl = gql`
  mutation updateCollectionStoryImageUrl(
    $externalId: String!
    $imageUrl: Url!
  ) {
    updateCollectionStoryImageUrl(
      data: { externalId: $externalId, imageUrl: $imageUrl }
    ) {
      ...CollectionStoryData
    }
  }
  ${CollectionStoryData}
`;
