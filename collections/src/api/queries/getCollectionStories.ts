import { gql } from '@apollo/client';
import { CollectionStoryData } from '../fragments/CollectionStoryData';

/**
 * Get collection stories for a given collection external id.
 * Deliberately fetching stories for a collection in a separate
 * query to make managing cache updates easier
 */
export const getCollectionStories = gql`
  query getCollectionStories($id: String!) {
    getCollection(externalId: $id) {
      stories {
        ...CollectionStoryData
      }
    }
  }
  ${CollectionStoryData}
`;
