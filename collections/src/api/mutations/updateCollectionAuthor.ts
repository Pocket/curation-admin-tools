import { gql } from '@apollo/client';
import { AuthorData } from '../fragments/AuthorData';

/**
 * Update an author
 */
export const updateCollectionAuthor = gql`
  mutation updateCollectionAuthor(
    $externalId: String!
    $name: String!
    #$slug: String
    $bio: Markdown
    $imageUrl: Url
    $active: Boolean
  ) {
    updateCollectionAuthor(
      data: {
        externalId: $externalId
        name: $name
        #slug: $slug
        bio: $bio
        imageUrl: $imageUrl
        active: $active
      }
    ) {
      ...AuthorData
    }
  }
  ${AuthorData}
`;
