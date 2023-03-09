import { gql } from '@apollo/client';
import { ShareableListProps } from '../fragments/ShareableListProps';

export const searchShareableList = gql`
  query searchShareableList($externalId: ID!) {
    searchShareableList(externalId: $externalId) {
      ...ShareableListProps
    }
  }
  ${ShareableListProps}
`;
