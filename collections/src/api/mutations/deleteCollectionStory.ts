import { gql } from '@apollo/client';
import { CollectionStoryData } from '../fragments/CollectionStoryData';

/**
 * Delete a collection story
 */
export const deleteCollectionStory = gql`
  mutation deleteCollectionStory($externalId: String!) {
    deleteCollectionStory(externalId: $externalId) {
      ...CollectionStoryData
    }
  }
  ${CollectionStoryData}
`;
