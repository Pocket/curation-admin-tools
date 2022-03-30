import { gql } from '@apollo/client';

export const uploadApprovedItemImage = gql`
  mutation uploadApprovedCorpusItemImage($image: Upload!) {
    uploadApprovedCorpusItemImage(data: $image) {
      url
    }
  }
`;
