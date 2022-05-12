import { gql } from '@apollo/client';

/**
 * Url metadata returned from the parser/client api
 */
export const urlMetadata = gql`
  fragment urlMetadata on UrlMetadata {
    url
    imageUrl
    publisher
    domain
    title
    excerpt
    language
    isSyndicated
    isCollection
    authors
  }
`;
