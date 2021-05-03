import { gql } from '@apollo/client';
import { AuthorData } from '../fragments/AuthorData';

/**
 * Seach collections
 */
export const getSearchCollections = gql`
  query getSearchCollections(
    $page: Int
    $perPage: Int
    $status: CollectionStatus
    $author: String
    $title: String
  ) {
    searchCollections(
      filters: { status: $status, author: $author, title: $title }
      page: $page
      perPage: $perPage
    ) {
      collections {
        externalId
        title
        slug
        excerpt
        intro
        imageUrl
        status
        authors {
          ...AuthorData
        }
      }
      pagination {
        totalResults
      }
    }
  }
  ${AuthorData}
`;
