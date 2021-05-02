import { gql } from '@apollo/client';
import { CollectionAuthors } from '../fragments/CollectionAuthors';

/**
 * Update a collection
 */
export const updateCollection = gql`
  mutation updateCollection(
    $id: String
    $title: String!
    $slug: String!
    $excerpt: Markdown!
    $intro: Markdown
    $status: CollectionStatus!
    $authorExternalId: String!
  ) {
    updateCollection(
      data: {
        externalId: $id
        title: $title
        slug: $slug
        excerpt: $excerpt
        intro: $intro
        status: $status
        authorExternalId: $authorExternalId
      }
    ) {
      externalId
      title
      slug
      excerpt
      intro
      imageUrl
      status
      ...CollectionAuthors
    }
  }
  ${CollectionAuthors}
`;
