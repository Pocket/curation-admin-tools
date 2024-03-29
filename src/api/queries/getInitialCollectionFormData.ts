import { gql } from '@apollo/client';
import { CollectionAuthorData } from '../fragments/CollectionAuthorData';

/**
 * Get a list of authors
 */
export const getInitialCollectionFormData = gql`
  query getInitialCollectionFormData($page: Int, $perPage: Int) {
    getCollectionAuthors(page: $page, perPage: $perPage) {
      authors {
        ...CollectionAuthorData
      }
    }

    labels {
      externalId
      name
    }

    getLanguages

    getCurationCategories {
      externalId
      name
      slug
    }

    getIABCategories {
      externalId
      name
      slug
      children {
        externalId
        name
        slug
      }
    }
  }
  ${CollectionAuthorData}
`;
