import { gql } from '@apollo/client';
import { ShareableListProps } from '../fragments/ShareableListProps';

export const moderateShareableList = gql`
  mutation moderateShareableList($data: ModerateShareableListInput!) {
    moderateShareableList(data: $data) {
      ...ShareableListProps
    }
  }
  ${ShareableListProps}
`;
