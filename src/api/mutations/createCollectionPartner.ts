import { gql } from '@apollo/client';
import { CollectionPartnerData } from '../fragments/CollectionPartnerData';

/**
 * Create a collection partner
 */
export const createCollectionPartner = gql`
  mutation createCollectionPartner(
    $name: String!
    $url: Url!
    $blurb: Markdown!
    $imageUrl: Url!
    $imageOptions: [CachedImageInput!]!
  ) {
    createCollectionPartner(
      data: { name: $name, url: $url, blurb: $blurb, imageUrl: $imageUrl }
    ) {
      ...CollectionPartnerData
    }
  }
  ${CollectionPartnerData}
`;
