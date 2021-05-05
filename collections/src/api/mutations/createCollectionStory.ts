import { gql } from '@apollo/client';

/**
 * Create a collection story
 */
export const createCollectionStory = gql`
  mutation createCollectionStory(
    $collectionExternalId: String!
    $url: Url!
    $title: String!
    $excerpt: Markdown!
    $imageUrl: Url!
    $authors: [CollectionStoryAuthorInput!]!
    $publisher: String!
    $sortOrder: Int
  ) {
    createCollectionStory(
      data: {
        collectionExternalId: $collectionExternalId
        url: $url
        title: $title
        excerpt: $excerpt
        imageUrl: $imageUrl
        authors: $authors
        publisher: $publisher
        sortOrder: $sortOrder
      }
    ) {
      externalId
      url
      title
      excerpt
      imageUrl
      authors {
        name
      }
      publisher
      sortOrder
    }
  }
`;
