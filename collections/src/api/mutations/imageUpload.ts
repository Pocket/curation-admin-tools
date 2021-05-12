import { gql } from '@apollo/client';

/**
 * Upload an image to S3
 */
export const imageUpload = gql`
  mutation imageUpload(
    $image: Upload!
    $width: Int!
    $height: Int!
    $fileSizeBytes: Int!
    $mimeType: String!
    $name: String!
  ) {
    collectionImageUpload(
      data: {
        image: $image
        width: $width
        height: $height
        fileSizeBytes: $fileSizeBytes
        mimeType: $mimeType
        name: $name
      }
    ) {
      url
    }
  }
`;
