import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { Box, Grid, Hidden, Typography } from '@material-ui/core';
import { HandleApiResponse } from '../../../_shared/components';
import {
  MiniNewTabScheduleList,
  ProspectListCard,
  RejectProspectModal,
} from '../../components';
import { client } from '../../api/prospect-api/client';
import {
  Prospect,
  useGetProspectsQuery,
} from '../../api/prospect-api/generatedTypes';
import { useGetScheduledItemsQuery } from '../../api/curated-corpus-api/generatedTypes';
import { useToggle } from '../../../_shared/hooks';

export const NewTabCurationPage: React.FC = (): JSX.Element => {
  // TODO: remove hardcoded value when New Tab selector is added to the page
  const newTabGuid = 'EN_US';

  // Get a list of prospects on the page
  const { loading, error, data } = useGetProspectsQuery(
    // We need to make sure these results are never served from the cache.
    {
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
      variables: { newTab: newTabGuid },
      client,
    }
  );

  // Get today and tomorrow's items that are already scheduled for this New Tab
  const {
    loading: loadingScheduled,
    error: errorScheduled,
    data: dataScheduled,
  } = useGetScheduledItemsQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      filters: {
        newTabGuid,
        startDate: DateTime.local().toFormat('yyyy-MM-dd'),
        endDate: DateTime.local().plus({ days: 1 }).toFormat('yyyy-MM-dd'),
      },
    },
  });

  /**
   * Set the current Prospect to be worked on (e.g., to be approved or rejected).
   */
  const [currentItem, setCurrentItem] = useState<Prospect | undefined>(
    undefined
  );

  /**
   * Keep track of whether the "Reject this prospect" modal is open or not.
   */
  const [rejectModalOpen, toggleRejectModal] = useToggle(false);

  return (
    <>
      {currentItem && (
        <RejectProspectModal
          prospect={currentItem}
          isOpen={rejectModalOpen}
          onSave={() => {
            // nothing to see here
          }}
          toggleModal={toggleRejectModal}
        />
      )}

      <h1>New Tab Curation</h1>
      <Box mb={3}>
        <Typography>
          I am curating for <strong>{newTabGuid}</strong> (temporarily
          hardcoded)
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={9}>
          {!data && <HandleApiResponse loading={loading} error={error} />}

          {data &&
            data.getProspects.map((prospect) => {
              return (
                <ProspectListCard
                  key={prospect.id}
                  prospect={prospect}
                  onReject={() => {
                    setCurrentItem(prospect);
                    toggleRejectModal();
                  }}
                />
              );
            })}
        </Grid>
        <Hidden xsDown>
          <Grid item sm={3}>
            <h4>Scheduled for New Tab</h4>
            {!dataScheduled && (
              <HandleApiResponse
                loading={loadingScheduled}
                error={errorScheduled}
              />
            )}
            {dataScheduled && (
              <MiniNewTabScheduleList
                scheduledItems={
                  dataScheduled.getScheduledCuratedCorpusItems.items
                }
              />
            )}
          </Grid>
        </Hidden>
      </Grid>
    </>
  );
};
