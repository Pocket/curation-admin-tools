import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { Button, HandleApiResponse, PartnerListCard } from '../../components';
import {
  CollectionPartner,
  useGetCollectionPartnersQuery,
} from '../../api/collection-api/generatedTypes';

/**
 * Partner List Page
 */
export const PartnerListPage = (): JSX.Element => {
  // Load partners
  const { loading, error, data } = useGetCollectionPartnersQuery({
    variables: { perPage: 50 },
  });

  return (
    <>
      <Box display="flex">
        <Box flexGrow={1} alignSelf="center">
          <h1>Partners</h1>
        </Box>
        <Box alignSelf="center">
          <Button component={Link} to="/partners/add/" buttonType="hollow">
            Add partner
          </Button>
        </Box>
      </Box>

      {!data && <HandleApiResponse loading={loading} error={error} />}

      {data &&
        data.getCollectionPartners?.partners.map(
          (partner: CollectionPartner) => {
            return (
              <PartnerListCard key={partner.externalId} partner={partner} />
            );
          }
        )}
    </>
  );
};
