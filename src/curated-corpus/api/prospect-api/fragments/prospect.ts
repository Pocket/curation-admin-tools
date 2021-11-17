import { gql } from '@apollo/client';

/**
 * Everything we need to fetch for a Prospect
 */
export const ProspectData = gql`
  fragment ProspectData on Prospect {
    id
    topic
    prospectType
    url
    imageUrl
    newTab
    publisher
    domain
    title
    excerpt
    language
    saveCount
    createdAt
  }
`;
