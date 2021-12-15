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
  useUploadApprovedCuratedCorpusItemImageMutation,
  useCreateApprovedCuratedCorpusItemMutation,
} from '../../api/curated-corpus-api/generatedTypes';
import {
  useRunMutation,
  useToggle,
  useNotifications,
} from '../../../_shared/hooks';

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

    // Mark the prospect as processed in the Prospect API datastore.
    // TODO: add logic here. Don't forget to connect to Prospect API for this mutation
  };

  const [uploadApprovedItemImage] =
    useUploadApprovedCuratedCorpusItemImageMutation();

  const [createApprovedItem] = useCreateApprovedCuratedCorpusItemMutation();

  const { showNotification } = useNotifications();

  const [prospectS3Image, setProspectS3Image] = useState<string | undefined>(
    undefined
  );

  const onProspectSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => {
    // If the parser returned an image, let's upload it to S3
    // First, side-step CORS issues that prevent us from downloading
    // the image directly from the publisher
    if (values.imageUrl) {
      const parserImageUrl =
        'https://pocket-image-cache.com/x/filters:no_upscale():format(jpg)/' +
        encodeURIComponent(values.imageUrl);

      // Get the file
      fetch(parserImageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          // Upload the file to S3
          uploadApprovedItemImage({
            variables: {
              image: blob,
            },
          })
            .then((imgUploadData) => {
              if (
                imgUploadData.data &&
                imgUploadData.data.uploadApprovedCuratedCorpusItemImage.url
              ) {
                const languageCode: string =
                  values.language === 'English' ? 'en' : 'de';
                const curationStatus = values.curationStatus.toUpperCase();
                const topic: string = values.topic.toUpperCase();
                const s3ImageUrl: string =
                  imgUploadData.data.uploadApprovedCuratedCorpusItemImage.url;

                const approvedProspect = {
                  prospectId: currentItem?.id ?? '',
                  url: values.url,
                  title: values.title,
                  excerpt: values.excerpt,
                  status: curationStatus,
                  language: languageCode,
                  publisher: values.publisher,
                  imageUrl: s3ImageUrl,
                  topic: topic,
                  isCollection: values.collection,
                  isShortLived: values.shortLived,
                  isSyndicated: values.syndicated,
                };
                // Don't show a notification about a successful S3 upload just yet -
                // that's just too many. Wait until we save the url to show another
                // success message
                createApprovedItem({
                  variables: {
                    data: { ...approvedProspect },
                  },
                })
                  .then(() => {
                    showNotification(
                      'Image uploaded to S3 and linked to prospect',
                      'success'
                    );
                    toggleApprovedItemModal();
                    // manually refresh the cache
                    refetch();
                    formikHelpers.setSubmitting(false);
                  })
                  .catch((error) => {
                    // manually refresh the cache
                    refetch();
                    showNotification(error.message, 'error');
                    formikHelpers.setSubmitting(false);
                  });
              }
            })
            .catch((error) => {
              // manually refresh the cache
              refetch();
              showNotification(error.message, 'error');
            });
        })
        .catch((error: Error) => {
          showNotification(
            'Could not process image - file may be too large.\n' +
              `(Original error: ${error.message})`,
            'error'
          );
          // manually refresh the cache
          refetch();
          formikHelpers.setSubmitting(false);
        });
    } else if (prospectS3Image) {
      // This if block is hit when the prospect doesn't have an imageUrl value but
      // the user uploads a new image.

      const languageCode: string = values.language === 'English' ? 'en' : 'de';
      const curationStatus = values.curationStatus.toUpperCase();
      const topic: string = values.topic.toUpperCase();
      const s3ImageUrl: string = prospectS3Image;

      const variables = {
        data: {
          prospectId: currentItem?.id ?? '',
          url: values.url,
          title: values.title,
          excerpt: values.excerpt,
          status: curationStatus,
          language: languageCode,
          publisher: values.publisher,
          imageUrl: s3ImageUrl,
          topic: topic,
          isCollection: values.collection,
          isShortLived: values.shortLived,
          isSyndicated: values.syndicated,
        },
      };

      // Executed the mutation to create an approved item
      runMutation(
        createApprovedItem,
        { variables },
        `Prospect "${values.title.substring(0, 50)}..." successfully approved`,
        () => {
          toggleApprovedItemModal();
          formikHelpers.setSubmitting(false);
        },
        () => {
          formikHelpers.setSubmitting(false);
        },
        refetch
      );
    } else {
      showNotification('Please upload an image before submitting', 'error');
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
