import React, { useState } from 'react';
import { FormikHelpers, FormikValues } from 'formik';
import {
  Prospect,
  useGetApprovedItemByUrlLazyQuery,
  useGetUrlMetadataLazyQuery,
} from '../../../api/generatedTypes';
import { AddProspectForm } from '../';
import { useNotifications } from '../../../_shared/hooks';
import { transformUrlMetaDataToProspect } from '../../helpers/helperFunctions';

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
   * The Prospecting page holds the prospect under consideration (its data being
   * fed to either ApprovedItem or RejectedItem forms while the curator is editing)
   * in the `currentProspect` state variable. We get the setter for this state
   * variable from the page-level component to be able to update it
   * when the manually added prospect is ready to be saved.
   */
  setCurrentProspect: (currentProspect: Prospect) => void;

  /**
   * Sets the state variable isRecommendation in the ProspectingPage component
   * We need to call this to be able to set the Curation Status field to Recommendation in the approved item form
   */
  setIsRecommendation: (isRecommendation: boolean) => void;

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
    setCurrentProspect,
    setIsRecommendation,
    setIsManualSubmission,
  } = props;

  // state variable to store the itemUrl field from the form
  const [itemUrl, setItemUrl] = useState<string>('');

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
    setItemUrl(values.itemUrl);
    // This kicks off Step 1 below.
    getApprovedItemByUrl({
      variables: {
        url: values.itemUrl,
      },
    });

    formikHelpers.resetForm();
  };

  // Step 1: when a URL is submitted, the first step is to check if it is already in the corpus.
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

      // set isManualSubmission state variable in the ProspectingPage component to true
      setIsManualSubmission(true);

      // Hide the AddProspect form
      toggleModal();
      // Show the ApprovedItem form and delegate back to the Prospecting page
      // from this point onwards
      toggleApprovedItemModal();
    },
  });

  return <AddProspectForm onCancel={toggleModal} onSubmit={onSubmit} />;
};
