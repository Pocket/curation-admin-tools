import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

export const updateApprovedItem = gql`
  mutation updateApprovedCuratedCorpusItem(
    $externalId: ID!
    $prospectId: ID!
    $url: Url!
    $title: String!
    $excerpt: String!
    $status: CuratedStatus!
    $language: String!
    $publisher: String!
    $imageUrl: Url!
    $topic: String!
    $isCollection: Boolean!
    $isShortLived: Boolean!
    $isSyndicated: Boolean!
  ) {
    updateApprovedCuratedCorpusItem(
      data: {
        externalId: $externalId
        prospectId: $prospectId
        url: $url
        title: $title
        excerpt: $excerpt
        status: $status
        language: $language
        publisher: $publisher
        imageUrl: $imageUrl
        topic: $topic
        isCollection: $isCollection
        isShortLived: $isShortLived
        isSyndicated: $isSyndicated
      }
    ) {
      ...CuratedItemData
    }
  }
  ${CuratedItemData}
`;
