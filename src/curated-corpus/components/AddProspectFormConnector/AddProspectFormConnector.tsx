import React, { useState } from 'react';
import { FormikHelpers, FormikValues } from 'formik';
import {
  ApprovedCorpusItem,
  Prospect,
  useGetApprovedItemByUrlLazyQuery,
  useGetUrlMetadataLazyQuery,
} from '../../../api/generatedTypes';
import { AddProspectForm } from '../';
import { transformUrlMetaDataToProspect } from '../../helpers/helperFunctions';
import { useNotifications } from '../../../_shared/hooks';

interface AddProspectFormConnectorProps {
  /**
   * Toggle the AddProspectModal to show/hide as necessary.
   */
  toggleModal: VoidFunction;

  /**
   * Toggle the modal that contains the ApprovedItem form as necessary.
   */
  toggleApprovedItemModal: VoidFunction;

  /**
   * Toggle the modal that contains the optional scheduling form as necessary.
   */
  toggleScheduleItemModal: VoidFunction;

  /**
   * The Prospecting page holds the prospect under consideration (its data being
   * fed to either ApprovedItem or RejectedItem forms while the curator is editing)
   * in the `currentProspect` state variable. We get the setter for this state
   * variable from the page-level component to be able to update it
   * when the manually added prospect is ready to be saved.
   */
  setCurrentProspect: (currentProspect: Prospect) => void;

  /**
   * Another setter from the Prospecting page that holds the approved item that's
   * just been saved and is hanging around for optional scheduling.
   */
  setApprovedItem: (item: ApprovedCorpusItem) => void;

  /**
   * Sets the state variable isRecommendation in the ProspectingPage component
   * We need to call this to be able to set the Curation Status field to Recommendation in the approved item form
   */
  setIsRecommendation: (isRecommendation: boolean) => void;

  /**
   * Sets the state variable isManualSubmission in the ProspectingPage component
   * We need to call this to be able to set the hidden Source field to Manual in the approved item form
   */
  setIsManualSubmission: (isManual: boolean) => void;
}

/**
 * This component contains all the business logic for the AddProspectForm workflow.
 *
 * @param props
 * @constructor
 */
export const AddProspectFormConnector: React.FC<
  AddProspectFormConnectorProps
> = (props) => {
  const {
    toggleModal,
    toggleApprovedItemModal,
    toggleScheduleItemModal,
    setCurrentProspect,
    setApprovedItem,
    setIsManualSubmission,
    setIsRecommendation,
  } = props;

  // state variable to store the itemUrl field from the form
  const [itemUrl, setItemUrl] = useState<string>('');

  // state variable to show/hide the loading bar in the AddProspectForm component when submitting
  // this is against our current pattern of using the formik.isSubmitting in the form component itself
  // to show a loading indicator. After a lot of debugging, we can't figure out why that way doesn't work hence resorting to this
  const [isLoaderShowing, setIsLoaderShowing] = useState<boolean>(false);

  // set up some hooks
  const { showNotification } = useNotifications();

  /**
   * Run through a series of steps when a Prospect is submitted manually
   *
   * @param values
   * @param formikHelpers
   */
  const onSubmit = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => {
    formikHelpers.setSubmitting(true);

    setItemUrl(values.itemUrl);
    // This kicks off Step 1 below.
    getApprovedItemByUrl({
      variables: {
        url: values.itemUrl,
      },
    });

    // set isManualSubmission state variable in the ProspectingPage component to true
    setIsManualSubmission(true);

    // show the loading bar
    setIsLoaderShowing(true);

    formikHelpers.resetForm();
  };

  // Step 1: when a URL is submitted, the first step is to check if it is already in the corpus.
  const [getApprovedItemByUrl] = useGetApprovedItemByUrlLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      const approvedItem = data?.getApprovedCorpusItemByUrl;

      // hide the loading bar after this failed submission
      setIsLoaderShowing(false);

      // Let the curators skip straight to the scheduling screen if the manually added
      // prospect is in the corpus already.
      if (approvedItem) {
        // Update the approved item to be worked on on the Prospecting page
        setApprovedItem(approvedItem);

        // Hide the Add Prospect form
        toggleModal();

        showNotification(
          'This story is already in the corpus, opening the optional scheduling modal',
          'info'
        );

        // Show the optional scheduling modal
        toggleScheduleItemModal();

        // Nothing else to do here - we can do an early exit
        return;
      }

      // fetch metadata for url if it doesn't exist in the corpus
      if (approvedItem === null) {
        // This leads us to Step 2 below.
        getUrlMetadata({
          variables: {
            url: itemUrl,
          },
        });
      }
    },
  });

  // Step 2: If the item is not yet in the corpus, get available metadata from it
  // from the Parser.
  const [getUrlMetadata] = useGetUrlMetadataLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      // create a Prospect object from the URL metadata to be consumed by
      // the ApprovedItem form
      const prospect = transformUrlMetaDataToProspect(data.getUrlMetadata);

      // set state variable so that it can be used by the ApprovedItem form
      setCurrentProspect(prospect);

      // set the isRecommendation state variable in the ProspectingPage component to true
      setIsRecommendation(true);

      // Hide the AddProspect form
      toggleModal();
      // Show the ApprovedItem form and delegate back to the Prospecting page
      // from this point onwards
      toggleApprovedItemModal();
    },
  });

  return (
    <AddProspectForm
      onCancel={toggleModal}
      onSubmit={onSubmit}
      isLoaderShowing={isLoaderShowing}
    />
  );
};
