import { gql } from '@apollo/client';
import { CuratedItemDataWithHistory } from './CuratedItemWithHistory';
import { RejectedItemData } from './rejectedItemData';
import {BasicParserItemData} from './BasicParserItemData'

/**
 * Everything we need to fetch for a Prospect, including optional
 * ApprovedCorpusItem and RejectedCorpusItem objects if there's a match by URL.
 */
export const ProspectDataWithCorpusItems = gql`
  fragment ProspectDataWithCorpusItems on Prospect {
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
      ...CuratedItemDataWithHistory
    }
    rejectedCorpusItem {
      ...RejectedItemData
    }
    item {
      ...BasicParserItemData
    }
  }
  ${CuratedItemDataWithHistory}
  ${RejectedItemData}
  ${BasicParserItemData}
`;
