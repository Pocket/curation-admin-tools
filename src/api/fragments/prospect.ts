import { gql } from '@apollo/client';
import { BasicParserItemData } from './BasicParserItemData';

/**
 * Everything we need to fetch for a Prospect
 */
export const ProspectData = gql`
  fragment ProspectData on Prospect {
    id
    prospectId
    scheduledSurfaceGuid
    topic
    prospectType
    url
    createdAt
    imageUrl
    authors
    publisher
    domain
    title
    excerpt
    language
    saveCount
    isSyndicated
    isCollection
    item {
      ...BasicParserItemData
    }
  }
  ${BasicParserItemData}
`;
