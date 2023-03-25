import { gql } from '@apollo/client';
import { ShareableListCompleteProps } from '../fragments/ShareableListCompleteProps';

export const moderateShareableList = gql`
  mutation moderateShareableList($data: ModerateShareableListInput!) {
    moderateShareableList(data: $data) {
      ...ShareableListCompleteProps
    }
  }
  ${ShareableListCompleteProps}
`;
