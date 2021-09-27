import { gql } from '@apollo/client';

/**
 * Get a list of curated items - no frills! yet
 */
export const getCuratedItems = gql`
  query getCuratedItems($page: Int, $perPage: Int) {
    getCuratedItems(page: $page, perPage: $perPage) {
      items {
        externalId
        title
        language
        url
        imageUrl
        excerpt
        status
        createdBy
        createdAt
        updatedAt
      }
      pagination {
        currentPage
        totalPages
        totalResults
        perPage
      }
    }
  }
`;
