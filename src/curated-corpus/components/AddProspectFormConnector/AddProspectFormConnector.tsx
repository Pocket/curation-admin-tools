import React, { useState } from 'react';
import { SharedFormButtonsProps } from '../../../_shared/components';
import {
  ApprovedCuratedCorpusItem,
  CreateApprovedCuratedCorpusItemInput,
  CreateScheduledCuratedCorpusItemInput,
  useCreateApprovedCuratedCorpusItemMutation,
  useCreateScheduledCuratedCorpusItemMutation,
  useGetApprovedItemByUrlLazyQuery,
  useGetUrlMetadataLazyQuery,
  useUploadApprovedCuratedCorpusItemImageMutation,
} from '../../../api/generatedTypes';
import {
  useNotifications,
  useRunMutation,
  useToggle,
} from '../../../_shared/hooks';
import {
  downloadAndUploadApprovedItemImageToS3,
  transformFormInputToCreateApprovedItemInput,
  transformUrlMetaDataToApprovedItem,
} from '../../helpers/helperFunctions';
import { FormikHelpers, FormikValues } from 'formik';
import { DateTime } from 'luxon';
import { ApprovedItemModal } from '../ApprovedItemModal/ApprovedItemModal';
import { ScheduleItemModal } from '../ScheduleItemModal/ScheduleItemModal';
import { AddProspectForm } from '../AddProspectForm/AddProspectForm';

interface AddProspectFormConnectorProps {
  toggleModal: VoidFunction;
}

export const AddProspectFormConnector: React.FC<
  AddProspectFormConnectorProps & SharedFormButtonsProps
> = (props) => {
  const { onCancel, toggleModal } = props;

  // state variable to store the itemUrl field from the form
  const [itemUrl, setItemUrl] = useState<string>('');

  // state variable to store the approved item built after
  // getting the item metadata
  const [approvedItem, setApprovedItem] = useState<ApprovedCuratedCorpusItem>();

  // set up some hooks
  const { showNotification } = useNotifications();

  // Keep track of whether the "Approve Item" modal is open or not
  const [approvedItemModalOpen, toggleApprovedItemModal] = useToggle(false);
  //Keep track of whether the "Schedule this item" modal is open or not.
  const [scheduleModalOpen, toggleScheduleModal] = useToggle(false);

  // function to toggle both modals
  const toggleApprovedItemAndProspectModal = () => {
    toggleApprovedItemModal();
    toggleModal();
  };

  const onSubmit = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => {
    setItemUrl(values.itemUrl);
    getApprovedItemByUrl({
      variables: {
        url: values.itemUrl,
      },
    });

    formikHelpers.resetForm();
  };

  // prepare the runMutation helper hook
  const { runMutation } = useRunMutation();

  // prepare mutation hook to upload image to s3
  const [uploadApprovedItemImage] =
    useUploadApprovedCuratedCorpusItemImageMutation();

  // prepare mutation hook to create approved item
  const [createApprovedItemMutation] =
    useCreateApprovedCuratedCorpusItemMutation();

  // prepare mutation hook to schedule the approved item
  const [scheduleCuratedItem] = useCreateScheduledCuratedCorpusItemMutation();

  // lazy query to check if url already exists in the corpus
  const [getApprovedItemByUrl] = useGetApprovedItemByUrlLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      const approvedItem = data?.getApprovedCuratedCorpusItemByUrl;

      // show error toast if the url exists already
      if (approvedItem) {
        showNotification('This URL already exists in the Corpus', 'error');
        return;
      }

      // fetch metadata for url if it doesn't exist in the corpus
      if (approvedItem === null) {
        getUrlMetadata({
          variables: {
            url: itemUrl,
          },
        });
      }
    },
  });

  // lazy query to get metadata for an url
  const [getUrlMetadata] = useGetUrlMetadataLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      // create an approved item object from the url metadata to be consumed by the edit form
      const approvedItem = transformUrlMetaDataToApprovedItem(
        data.getUrlMetadata,
        false
      );

      // set state variable so that it can be used by the edit form
      setApprovedItem(approvedItem);
      // show edit form
      toggleApprovedItemModal();
    },
  });

  // callback which will be called after clicking save on the edit form
  // it uploads the item's image to S3 first and then calls the mutation to
  // create a new approved item with s3 image url
  const createApprovedItem = async (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): Promise<void> => {
    // upload item image to s3
    const s3ImageUrl = await downloadAndUploadApprovedItemImageToS3(
      values.imageUrl,
      uploadApprovedItemImage
    );

    // build an approved item using the helper and replace the imageUrl with the s3ImageUrl
    const createApprovedItemInput: CreateApprovedCuratedCorpusItemInput = {
      ...transformFormInputToCreateApprovedItemInput(values),
      imageUrl: s3ImageUrl,
    };
    // call the create approved item mutation
    runMutation(
      createApprovedItemMutation,
      { variables: { data: { ...createApprovedItemInput } } },
      'Item successfully added to the curated corpus.',
      (data) => {
        // set the state variable approvedItem to the newly created approved item
        // that will be used by the schedule modal
        data.createApprovedCuratedCorpusItem &&
          setApprovedItem({
            ...data.createApprovedCuratedCorpusItem,
          });

        //close approved item modal
        toggleApprovedItemModal();
        // open schedule modal
        toggleScheduleModal();
        formikHelpers.setSubmitting(false);
      }
    );
  };

  // callback which will be passed to the ScheduleItem modal and will execute
  // the mutation to schedule an approved item
  const onScheduleSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    // Set out all the variables we need to pass to the mutation
    const variables: CreateScheduledCuratedCorpusItemInput = {
      approvedItemExternalId: approvedItem?.externalId!,
      scheduledSurfaceGuid: values.scheduledSurfaceGuid,
      scheduledDate: values.scheduledDate.toISODate(),
    };

    // Run the mutation
    runMutation(
      scheduleCuratedItem,
      { variables },
      `Item scheduled successfully for ${values.scheduledDate.toLocaleString(
        DateTime.DATE_FULL
      )}`,
      () => {
        // close schedule modal
        toggleScheduleModal();
        // close add prospect modal
        toggleModal();
        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      }
    );
  };

  return (
    <>
      <AddProspectForm onCancel={onCancel} onSubmit={onSubmit} />
      {approvedItem && (
        <>
          <ApprovedItemModal
            heading="Review Item"
            isRecommendation={true}
            isOpen={approvedItemModalOpen}
            onSave={createApprovedItem}
            toggleModal={toggleApprovedItemAndProspectModal}
            approvedItem={approvedItem}
          />
          <ScheduleItemModal
            headingCopy="Optional: schedule this item"
            approvedItem={approvedItem}
            isOpen={scheduleModalOpen}
            toggleModal={() => {
              toggleScheduleModal();
              toggleModal();
            }}
            onSave={onScheduleSave}
          />
        </>
      )}
    </>
  );
};
