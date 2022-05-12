import { gql } from '@apollo/client';
import { CuratedItemData } from './curatedItemData';
import { RejectedItemData } from './rejectedItemData';

/**
 * Everything we need to fetch for a Prospect, including optional
 * ApprovedCorpusItem and RejectedCorpusItem objects if there's a match by URL.
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
    approvedCorpusItem {
      ...CuratedItemData
    }
    rejectedCorpusItem {
      ...RejectedItemData
    }
  }
  ${CuratedItemData}
  ${RejectedItemData}
`;
