import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { Box, Button, Grid, Hidden, Typography } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import { HandleApiResponse } from '../../../_shared/components';
import {
  ApprovedItemModal,
  NewTabGroupedList,
  ProspectListCard,
  RefreshProspectsModal,
  RejectItemModal,
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
  useCreateApprovedCuratedCorpusItemMutation,
  useGetScheduledItemsQuery,
  useRejectProspectMutation,
  useUploadApprovedCuratedCorpusItemImageMutation,
} from '../../api/curated-corpus-api/generatedTypes';
import {
  useNotifications,
  useRunMutation,
  useToggle,
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
    // Do not cache prospects at all. On update, remove the relevant prospect
    // card from the screen manually once the prospect has been curated.
    fetchPolicy: 'no-cache',
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

  /**
   * Keep track of whether the "Refresh Prospects" modal is open or not.
   */
  const [refreshProspectsModalOpen, toggleRefreshProspectsModal] =
    useToggle(false);

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // Prepare the "reject prospect" mutation
  const [rejectProspect] = useRejectProspectMutation();
  // Prepare the "update prospect as curated" mutation
  const [updateProspectAsCurated] = useUpdateProspectAsCuratedMutation({
    client,
  });

  // Instead of working off Apollo Client's cache for the `getProspects` query
  // let's set up another variable for the prospect card list.
  const [prospects, setProspects] = useState<Prospect[]>([]);

  // When the batch of random prospects has loaded, update our `prospects` variable
  // with the contents of the API response. This will allow us to remove items from
  // the response array and unmount the relevant prospect cards when they have been
  // processed.
  useEffect(() => {
    setProspects(data?.getProspects!);
  }, [data]);

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
        prospectId: currentItem?.id!,
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
      undefined,
      () => {
        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      }
    );

    // Add the prospect to the rejected corpus
    runMutation(
      rejectProspect,
      { variables },
      `Item successfully added to the rejected corpus.`,
      () => {
        // Hide the modal
        toggleRejectModal();

        // Remove the newly rejected item from the list of prospects displayed
        // on the page.
        setProspects(
          prospects.filter((prospect) => prospect.id !== currentItem?.id!)
        );

        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      }
    );
  };

  // Prepare the create approved item mutation
  const [createApprovedItem] = useCreateApprovedCuratedCorpusItemMutation();

  // Prepare the upload approved item image mutation
  const [uploadApprovedItemImage] =
    useUploadApprovedCuratedCorpusItemImageMutation();

  // The toast notification hook
  const { showNotification } = useNotifications();

  // state variable to store s3 image url when user uploads a new image
  const [userUploadedS3ImageUrl, setUserUploadedS3ImageUrl] =
    useState<string>();

  /**
   *
   * This function gets called by the onCuratedItemSave function
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

    const approvedItem = {
      prospectId: currentItem?.id!,
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
    runMutation(
      createApprovedItem,
      { variables: { data: { ...approvedItem } }, client },
      'Item successfully added to the curated corpus.',
      () => {
        // call the mutation to mark prospect as approved
        runMutation(
          updateProspectAsCurated,
          { variables: { prospectId: currentItem?.id } },
          undefined,
          () => {
            toggleApprovedItemModal();

            // Remove the newly curated item from the list of prospects displayed
            // on the page.
            setProspects(
              prospects.filter((prospect) => prospect.id !== currentItem?.id!)
            );

            formikHelpers.setSubmitting(false);
          },
          () => {
            formikHelpers.setSubmitting(false);
          }
        );
      }
    );
  };

  /**
   *
   * This function gets called when the user saves(approves) a prospect
   */
  const onCuratedItemSave = async (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => {
    try {
      // set s3ImageUrl variable to the user uploaded s3 image url
      let s3ImageUrl = userUploadedS3ImageUrl;

      // if user uploaded s3 url does not exist
      // download the image from the publisher and upload it to s3
      if (!s3ImageUrl) {
        s3ImageUrl = await downloadAndUploadApprovedItemImageToS3(
          values.imageUrl,
          uploadApprovedItemImage
        );
      }

      // create an approved item and mark the prospect as curated
      await createApprovedItemAndMarkAsCurated(
        s3ImageUrl,
        values,
        formikHelpers
      );
    } catch (error: any) {
      showNotification(error.message, 'error');
      return;
    }
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
            heading={isRecommendation ? 'Recommend' : 'Add to Corpus'}
            isOpen={approvedItemModalOpen}
            onSave={onCuratedItemSave}
            toggleModal={toggleApprovedItemModal}
            onImageSave={setUserUploadedS3ImageUrl}
          />
        </>
      )}

      <RefreshProspectsModal
        isOpen={refreshProspectsModalOpen}
        onConfirm={() => {
          refetch();
          toggleRefreshProspectsModal();
        }}
        toggleModal={toggleRefreshProspectsModal}
      />

      <h1>New Tab Curation</h1>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={9}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography>
                I am curating for <strong>{newTabGuid}</strong> (temporarily
                hardcoded)
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                  color="default"
                  onClick={() => {
                    // If all the prospects have been processed already,
                    // there is no need for a confirmation dialogue here,
                    // let's just fetch a new batch of prospects.
                    prospects && prospects.length > 0
                      ? toggleRefreshProspectsModal()
                      : refetch();
                  }}
                >
                  <CachedIcon fontSize="large" />
                </Button>
              </Box>
            </Grid>
          </Grid>

          {!prospects && <HandleApiResponse loading={loading} error={error} />}

          {prospects &&
            prospects.map((prospect) => {
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
