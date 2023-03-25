import React, { useState } from 'react';
import { useRunMutation } from '../../../_shared/hooks';
import { ShareableListModerationForm } from '../';
import { FormikHelpers, FormikValues } from 'formik';
import {
  useModerateShareableListMutation,
  ModerateShareableListInput,
  ShareableListComplete,
} from '../../../api/generatedTypes';

interface ShareableListFormConnectorProps {
  /**
   * Toggle the ShareableListFormConnectorProps to show/hide as necessary.
   */
  toggleModal: VoidFunction;

  /**
   * A helper function from Apollo Client that triggers a new API call to refetch
   * the data for a given query.
   */
  refetch: VoidFunction;

  /**
   * An object with everything shareableList-related in it.
   */
  shareableList: ShareableListComplete;

  /**
   * Whether or not to run the moderateShareableList mutation.
   */
  runModerateShareableListMutation?: boolean;
}

/**
 * Parent component for the ShareableListForm component
 */
export const ShareableListFormConnector: React.FC<
  ShareableListFormConnectorProps
> = (props): JSX.Element => {
  const {
    toggleModal,
    refetch,
    shareableList,
    runModerateShareableListMutation,
  } = props;

  const [isLoaderShowing, setIsLoaderShowing] = useState<boolean>(false);
  const [moderateShareableListMutation] = useModerateShareableListMutation();

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  const onSubmit = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    // if runModerateShareableListMutation flag is true, moderateShareableList
    if (runModerateShareableListMutation) {
      // construct the ModerateShareableListInput
      let moderationReason;
      // we need to construct a stringified JSON obj to pass in the moderation reason and the details (optional)
      // the list of moderation reasons is not stored in the back-end db, so we keep track of the current reason
      // from the constructed JSON obj. This also makes it easier to retrieve and display the values.
      if (values.moderationDetails) {
        moderationReason = {
          reason: values.moderationReason,
          details: values.moderationDetails,
        };
      } else {
        moderationReason = {
          reason: values.moderationReason,
        };
      }
      const input: ModerateShareableListInput = {
        externalId: shareableList.externalId,
        moderationStatus: values.moderationStatus,
        moderationReason: JSON.stringify(moderationReason),
      };
      console.log(input);
      runMutation(
        moderateShareableListMutation,
        { variables: { data: input } },
        `"${shareableList.title} is now ${input.moderationStatus}"`,
        () => {
          setIsLoaderShowing(false);
          toggleModal();
          formikHelpers.setSubmitting(false);
        },
        () => {
          setIsLoaderShowing(false);
          formikHelpers.setSubmitting(false);
        },
        refetch
      );
    }
    setIsLoaderShowing(true);
  };
  return (
    <ShareableListModerationForm
      onCancel={toggleModal}
      onSubmit={onSubmit}
      isLoaderShowing={isLoaderShowing}
      shareableList={shareableList}
    />
  );
};
