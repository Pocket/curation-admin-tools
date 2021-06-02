import { gql } from '@apollo/client';
import { CollectionData } from '../fragments/CollectionData';

/**
 * Create a collection
 */
export const createCollection = gql`
  mutation createCollection(
    $title: String!
    $slug: String!
    $excerpt: Markdown
    $intro: Markdown
    $status: CollectionStatus!
    $authorExternalId: String!
  ) {
    createCollection(
      data: {
        title: $title
        slug: $slug
        excerpt: $excerpt
        intro: $intro
        status: $status
        authorExternalId: $authorExternalId
      }
    ) {
      ...CollectionData
    }
  }
  ${CollectionData}
`;
