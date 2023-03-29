import { gql } from '@apollo/client';
import { ShareableListCompleteProps } from '../fragments/ShareableListCompleteProps';

export const searchShareableList = gql`
  query searchShareableList($externalId: ID!) {
    searchShareableList(externalId: $externalId) {
      ...ShareableListCompleteProps
    }
  }
  ${ShareableListCompleteProps}
`;
