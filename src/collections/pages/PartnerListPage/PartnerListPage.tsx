import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@material-ui/core';
import {
  Button,
  HandleApiResponse,
  LoadMore,
} from '../../../_shared/components';
import { PartnerListCard } from '../../components';
import {
  CollectionPartner,
  useGetCollectionPartnersQuery,
} from '../../../api/generatedTypes';
import { config } from '../../../config';
import { useFetchMoreResults } from '../../../_shared/hooks';

/**
 * Partner List Page
 */
export const PartnerListPage = (): JSX.Element => {
  // Load partners
  const [loading, reloading, error, data, updateData] = useFetchMoreResults(
    useGetCollectionPartnersQuery,
    {
      variables: {
        perPage: config.pagination.partnersPerPage,
        page: 1,
      },
    }
  );

  return (
    <>
      <Box display="flex">
        <Box flexGrow={1} alignSelf="center">
          <h1>Partners</h1>
        </Box>
        <Box alignSelf="center">
          <Button
            component={Link}
            to="/collections/partners/add/"
            buttonType="hollow"
          >
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

      {data && (
        <LoadMore
          buttonDisabled={
            data.getCollectionPartners.partners.length ===
            data.getCollectionPartners.pagination?.totalResults
          }
          loadMore={updateData}
          showSpinner={reloading}
        />
      )}
    </>
  );
};
