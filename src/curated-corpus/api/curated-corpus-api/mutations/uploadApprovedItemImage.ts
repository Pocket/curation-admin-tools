import { gql } from '@apollo/client';

export const uploadApprovedItemImage = gql`
  mutation uploadApprovedCuratedCorpusItemImage($image: Upload!) {
    uploadApprovedCuratedCorpusItemImage(data: $image) {
      url
    }
  }
`;
