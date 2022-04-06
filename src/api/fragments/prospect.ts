import { gql } from '@apollo/client';
import { CuratedItemData } from './curatedItemData';

/**
 * Everything we need to fetch for a Prospect, including an optional
 * ApprovedCorpusItem object if there's a match by URL.
 */
export const ProspectData = gql`
  fragment ProspectData on Prospect {
    id
    scheduledSurfaceGuid
    topic
    prospectType
    url
    createdAt
    imageUrl
    publisher
    domain
    title
    excerpt
    language
    saveCount
    isSyndicated
    isCollection
    approvedCorpusItem {
      ...CuratedItemData
    }
  }
  ${CuratedItemData}
`;
