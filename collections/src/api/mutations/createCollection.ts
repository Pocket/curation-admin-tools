import { gql } from '@apollo/client';
import { AuthorData } from '../fragments/AuthorData';

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
