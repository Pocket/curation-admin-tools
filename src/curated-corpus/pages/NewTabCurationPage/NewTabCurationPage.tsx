import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { Box, Grid, Hidden, Typography } from '@material-ui/core';
import { HandleApiResponse } from '../../../_shared/components';
import {
  NewTabGroupedList,
  ProspectListCard,
  RejectItemModal,
  ApprovedItemModal,
} from '../../components';
import { client } from '../../api/prospect-api/client';
import {
  Prospect,
  useGetProspectsQuery,
  useUpdateProspectAsCuratedMutation,
} from '../../api/prospect-api/generatedTypes';
import {
  RejectProspectMutationVariables,
  ScheduledCuratedCorpusItemsResult,
  useGetScheduledItemsQuery,
  useRejectProspectMutation,
} from '../../api/curated-corpus-api/generatedTypes';
import { useRunMutation, useToggle } from '../../../_shared/hooks';
import { transformProspectToApprovedItem } from '../../helpers/helperFunctions';
import { FormikHelpers, FormikValues } from 'formik';

export const NewTabCurationPage: React.FC = (): JSX.Element => {
  // TODO: remove hardcoded value when New Tab selector is added to the page
  const newTabGuid = 'EN_US';

  // Get a list of prospects on the page
  const { loading, error, data, refetch } = useGetProspectsQuery({
    notifyOnNetworkStatusChange: true,
    variables: { newTab: newTabGuid },
    client,
  });

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

  const [isRecommendation, setIsRecommendation] = useState<boolean>(false);

  /**
   * Keep track of whether the "Reject this prospect" modal is open or not.
   */
  const [rejectModalOpen, toggleRejectModal] = useToggle(false);

  /**
   * Keep track of whether the "Edit Item" modal is open or not.
   */
  const [approvedItemModalOpen, toggleApprovedItemModal] = useToggle(false);

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // Prepare the "reject prospect" mutation
  const [rejectProspect] = useRejectProspectMutation();
  // Prepare the "update prospect as curated" mutation
  const [updateProspectAsCurated] = useUpdateProspectAsCuratedMutation({
    client,
  });

  /**
   * Add the prospect to the rejected corpus.
   * Additionally, let Prospect API know the prospect has been processed.
   *
   * @param values
   * @param formikHelpers
   */
  const onRejectSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    // Set out all the variables we need to pass to the first mutation
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

    // Mark the prospect as processed in the Prospect API datastore.
    runMutation(
      updateProspectAsCurated,
      { variables: { prospectId: currentItem?.id }, client },
      `Item successfully marked as curated.`,
      () => {
        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      },
      refetch
    );

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
  };

  const onProspectSave = () => {
    //TODO: @Herraj - replace with mutation logic in the next PR
    console.log('prospect save clicked');
  };

  return (
    <>
      {currentItem && (
        <>
          <RejectItemModal
            prospect={currentItem}
            isOpen={rejectModalOpen}
            onSave={onRejectSave}
            toggleModal={toggleRejectModal}
          />

          <ApprovedItemModal
            approvedItem={transformProspectToApprovedItem(
              currentItem,
              isRecommendation
            )}
            isOpen={approvedItemModalOpen}
            onSave={onProspectSave}
            toggleModal={toggleApprovedItemModal}
            onImageSave={() => ({})}
          />
        </>
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
                  onAddToCorpus={() => {
                    setCurrentItem(prospect);
                    setIsRecommendation(false);
                    toggleApprovedItemModal();
                  }}
                  onRecommend={() => {
                    setCurrentItem(prospect);
                    setIsRecommendation(true);
                    toggleApprovedItemModal();
                  }}
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
                  <NewTabGroupedList key={data.scheduledDate} data={data} />
                )
              )}
          </Grid>
        </Hidden>
      </Grid>
    </>
  );
};
