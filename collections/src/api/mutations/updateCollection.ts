import { gql } from '@apollo/client';
import { AuthorData } from '../fragments/AuthorData';

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
      authors {
        ...AuthorData
      }
    }
  }
  ${AuthorData}
`;
