import { gql } from '@apollo/client';

/**
 * All the properties that are needed to display components with collection
 * story data in them (such as media cards or forms)
 */
export const CollectionStoryData = gql`
  fragment CollectionStoryData on CollectionStory {
    externalId
    url
    title
    excerpt
    imageUrl
    authors {
      name
      sortOrder
    }
    publisher
    fromPartner
    sortOrder
  }
`;
