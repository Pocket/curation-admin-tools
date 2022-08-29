import { gql } from '@apollo/client';
import { CollectionAuthorData } from './CollectionAuthorData';
// import { ImageData } from './ImageData';

/**
 * All the properties that are needed to display and edit collections
 *
 * Note that the data returned by this fragment does not include collection
 * stories which are loaded on the individual collection page separately.
 */
export const CollectionData = gql`
  fragment CollectionData on Collection {
    externalId
    title
    slug
    excerpt
    intro
    image {
      cachedImages(imageOptions: $imageOptions) {
        height
        id
        url
        width
      }
      caption
      credit
      height
      imageId
      targetUrl
      url
      width
    }
    language
    status
    authors {
      ...CollectionAuthorData
    }
    curationCategory {
      externalId
      name
      slug
    }
    IABParentCategory {
      externalId
      name
      slug
    }
    IABChildCategory {
      externalId
      name
      slug
    }
    partnership {
      externalId
      type
      name
      url
      imageUrl
      blurb
    }
  }
  ${CollectionAuthorData}
`;
