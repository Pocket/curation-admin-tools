import { gql } from '@apollo/client';
import { AuthorData } from '../fragments/AuthorData';

/**
 * Get collection by its external id.
 */
export const getCollectionById = gql`
  query getCollectionByExternalId($externalId: String!) {
    getCollection(externalId: $externalId) {
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
  }
  ${AuthorData}
`;
