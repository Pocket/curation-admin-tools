import { gql } from '@apollo/client';
import { CollectionStoryData } from '../fragments/CollectionStoryData';

/**
 * Update a collection story
 */
export const updateCollectionStory = gql`
  mutation updateCollectionStory(
    $externalId: String!
    $url: Url!
    $title: String!
    $excerpt: Markdown!
    $imageUrl: Url!
    $authors: [CollectionStoryAuthorInput!]!
    $publisher: String!
    $sortOrder: Int
  ) {
    updateCollectionStory(
      data: {
        externalId: $externalId
        url: $url
        title: $title
        excerpt: $excerpt
        imageUrl: $imageUrl
        authors: $authors
        publisher: $publisher
        sortOrder: $sortOrder
      }
    ) {
      ...CollectionStoryData
    }
  }
  ${CollectionStoryData}
`;
