import { gql } from '@apollo/client';
import { AuthorData } from '../fragments/AuthorData';

/**
 * Create an author
 */
export const createCollectionAuthor = gql`
  mutation createCollectionAuthor(
    $name: String!
    $slug: String
    $bio: Markdown
    $imageUrl: Url
  ) {
    createCollectionAuthor(
      data: { name: $name, slug: $slug, bio: $bio, imageUrl: $imageUrl }
    ) {
      ...AuthorData
    }
  }
  ${AuthorData}
`;
