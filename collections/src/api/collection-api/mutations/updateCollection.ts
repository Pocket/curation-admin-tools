import { gql } from '@apollo/client';
import { CollectionData } from '../fragments/CollectionData';

/**
 * Update a collection
 */
export const updateCollection = gql`
  mutation updateCollection(
    $externalId: String
    $title: String!
    $slug: String!
    $excerpt: Markdown!
    $intro: Markdown
    $status: CollectionStatus!
    $authorExternalId: String!
    $imageUrl: Url
  ) {
    updateCollection(
      data: {
        externalId: $externalId
        title: $title
        slug: $slug
        excerpt: $excerpt
        intro: $intro
        status: $status
        authorExternalId: $authorExternalId
        imageUrl: $imageUrl
      }
    ) {
      ...CollectionData
    }
  }
  ${CollectionData}
`;
