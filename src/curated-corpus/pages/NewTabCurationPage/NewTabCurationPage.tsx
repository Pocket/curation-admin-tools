import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { Box, Grid, Hidden, Typography } from '@material-ui/core';
import { HandleApiResponse } from '../../../_shared/components';
import {
  NewTabGroupedList,
  ProspectListCard,
  RejectItemModal,
} from '../../components';
import { client } from '../../api/prospect-api/client';
import {
  Prospect,
  useGetProspectsQuery,
} from '../../api/prospect-api/generatedTypes';
import {
  RejectProspectMutationVariables,
  ScheduledCuratedCorpusItemsResult,
  useGetScheduledItemsQuery,
  useRejectProspectMutation,
} from '../../api/curated-corpus-api/generatedTypes';
import { useRunMutation, useToggle } from '../../../_shared/hooks';
import { FormikHelpers, FormikValues } from 'formik';

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

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // 1. Prepare the "reject prospect" mutation
  const [rejectProspect] = useRejectProspectMutation();
  // 2. Add the prospect to the rejected corpus
  // 3. Additionally, let Prospect API know the prospect has been processed.
  const onRejectSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    // Set out all the variables we need to pass to the mutation
    const variables: RejectProspectMutationVariables = {
      data: {
        prospectId: currentItem?.id ?? '', // TODO: sort out types here
        url: currentItem?.url,
        title: currentItem?.title,
        topic: currentItem?.topic ?? '',
        language: currentItem?.language,
        publisher: currentItem?.publisher,
        reason: values.reason,
      },
    };

    // Add the prospect to the rejected corpus
    runMutation(
      rejectProspect,
      { variables },
      `Item successfully added to the rejected corpus.`,
      () => {
        toggleRejectModal();
        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      }
    );

    // Mark the prospect as processed in the Prospect API datastore.
    // TODO: add logic here. Don't forget to connect to Prospect API for this mutation
  };

  return (
    <>
      {currentItem && (
        <RejectItemModal
          prospect={currentItem}
          isOpen={rejectModalOpen}
          onSave={onRejectSave}
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
            {dataScheduled &&
              dataScheduled.getScheduledCuratedCorpusItems.map(
                (data: ScheduledCuratedCorpusItemsResult) => (
                  <NewTabGroupedList
                    key={data.scheduledDate}
                    data={data}
                    isSidebar
                  />
                )
              )}
          </Grid>
        </Hidden>
      </Grid>
    </>
  );
};
