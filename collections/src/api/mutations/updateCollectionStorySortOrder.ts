import { gql } from '@apollo/client';
import { CollectionStoryData } from '../fragments/CollectionStoryData';

/**
 * Update a sort order for a collection story
 */
export const updateCollectionStorySortOrder = gql`
  mutation updateCollectionStorySortOrder(
    $externalId: String!
    $sortOrder: Int!
  ) {
    updateCollectionStorySortOrder(
      data: { externalId: $externalId, sortOrder: $sortOrder }
    ) {
      ...CollectionStoryData
    }
  }
  ${CollectionStoryData}
`;
