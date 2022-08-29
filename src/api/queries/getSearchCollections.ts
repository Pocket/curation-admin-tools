import { gql } from '@apollo/client';
import { CollectionData } from '../fragments/CollectionData';

/**
 * Search collections
 */
export const getSearchCollections = gql`
  query getSearchCollections(
    $page: Int
    $perPage: Int
    $status: CollectionStatus
    $author: String
    $title: String
    $imageOptions: [CachedImageInput!]!
  ) {
    searchCollections(
      filters: { status: $status, author: $author, title: $title }
      page: $page
      perPage: $perPage
    ) {
      collections {
        ...CollectionData
      }
      pagination {
        totalResults
      }
    }
  }
  ${CollectionData}
`;
