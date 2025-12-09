import { gql } from '@apollo/client';

/**
 * Create or update a publisher domain mapping
 */
export const createOrUpdatePublisherDomain = gql`
  mutation createOrUpdatePublisherDomain(
    $data: CreateOrUpdatePublisherDomainInput!
  ) {
    createOrUpdatePublisherDomain(data: $data) {
      domainName
      publisher
      createdAt
      createdBy
      updatedAt
      updatedBy
    }
  }
`;
