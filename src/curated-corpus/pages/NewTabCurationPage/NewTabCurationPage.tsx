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
  useCreateApprovedCuratedCorpusItemMutation,
  useUploadApprovedCuratedCorpusItemImageMutation,
} from '../../api/curated-corpus-api/generatedTypes';
import {
  useRunMutation,
  useToggle,
  useNotifications,
} from '../../../_shared/hooks';

import {
  downloadAndUploadApprovedItemImageToS3,
  transformProspectToApprovedItem,
} from '../../helpers/helperFunctions';
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
      '',
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

    // Mark the prospect as processed in the Prospect API datastore.
    // TODO: add logic here. Don't forget to connect to Prospect API for this mutation
  };

  // Prepare the create approved item mutation
  const [createApprovedItem] = useCreateApprovedCuratedCorpusItemMutation();

  // Prepare the upload approved item image mutation
  const [uploadApprovedItemImage] =
    useUploadApprovedCuratedCorpusItemImageMutation();

  // The toast notification hook
  const { showNotification } = useNotifications();

  // State variable to track if the user has uploaded a new image
  const [prospectS3Image, setProspectS3Image] = useState<string | undefined>(
    undefined
  );

  /**
   *
   * This function gets called by the onProspectSave function
   * it creates an approved item from a prospect and marks it as curated
   */
  const createApprovedItemAndMarkAsCurated = async (
    s3ImageUrl: string,
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): Promise<void> => {
    //build an approved item
    const languageCode: string = values.language === 'English' ? 'en' : 'de';
    const curationStatus = values.curationStatus.toUpperCase();
    const topic: string = values.topic.toUpperCase();
    const imageUrl: string = s3ImageUrl;

    const approvedProspect = {
      prospectId: currentItem?.id ?? '',
      url: values.url,
      title: values.title,
      excerpt: values.excerpt,
      status: curationStatus,
      language: languageCode,
      publisher: values.publisher,
      imageUrl: imageUrl,
      topic: topic,
      isCollection: values.collection,
      isShortLived: values.shortLived,
      isSyndicated: values.syndicated,
    };

    // call the create approved item mutation
    const data = await createApprovedItem({
      variables: {
        data: { ...approvedProspect },
      },
    });

    // if approved item is created then mark prospect as curated
    if (data.data?.createApprovedCuratedCorpusItem) {
      runMutation(
        updateProspectAsCurated,
        { variables: { prospectId: currentItem?.id }, client },
        '',
        () => {
          formikHelpers.setSubmitting(false);
        },
        () => {
          formikHelpers.setSubmitting(false);
        },
        refetch
      );

      showNotification(
        'Item successfully added to the curated corpus.',
        'success'
      );
      toggleApprovedItemModal();
      // manually refresh the cache
      formikHelpers.setSubmitting(false);
    }
  };

  /**
   *
   * This function gets called when the user saves(approves) a prospect
   */
  const onProspectSave = async (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => {
    // early exit if the prospect does not have an imageUrl
    // and the user has not uploaded a new image
    if (!values.imageUrl && !prospectS3Image) {
      showNotification('Please upload an image before submitting', 'error');
      return;
    }
    // set `s3ImageUrl` variable to user provided one if it exists
    let s3ImageUrl = prospectS3Image;
    // if the user has not uploaded a new image, upload the one on prospect
    if (!s3ImageUrl) {
      try {
        // this is using the prospect's image url
        // also passing in the `uploadApprovedItem` mutation callback
        s3ImageUrl = await downloadAndUploadApprovedItemImageToS3(
          values.imageUrl,
          uploadApprovedItemImage
        );
      } catch (error: any) {
        showNotification(error.message, 'error');
        return;
      }
    }
    // create approved item and mark it with our s3 image url
    createApprovedItemAndMarkAsCurated(s3ImageUrl, values, formikHelpers);
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
            onImageSave={setProspectS3Image}
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
