import React from 'react';
import { FormikHelpers, FormikValues } from 'formik';
import {
  ActionScreen,
  ApprovedCorpusItem,
  useRejectApprovedItemMutation,
} from '../../../../api/generatedTypes';
import { useRunMutation } from '../../../../_shared/hooks';
import { RejectItemModal } from '../../';

interface RejectCorpusItemActionProps {
  /**
   * The approved item that is about to become a rejected item instead.
   */
  item: ApprovedCorpusItem;

  /**
   * Identify from which screen the rejection action happened.
   */
  actionScreen: ActionScreen;

  /**
   * A state variable that tracks whether the RejectItemModal is visible
   * on the page or not.
   * This has to be passed down from the parent component as other components
   * may need to use it, too.
   */
  modalOpen: boolean;

  /**
   * A function that toggles the RejectItemModal's visibility on and off.
   * This has to be passed down from the parent component as other components
   * may need to use it, too.
   */
  toggleModal: VoidFunction;

  /**
   * A function that triggers a new API call to refetch the data for a given
   * query. Needed on the Corpus page to take the newly rejected curated item
   * off the page. NOT needed on the CorpusItem page.
   */
  refetch?: VoidFunction;
}

/**
 * This component encapsulates the logic needed to reject a corpus item -
 * send through a mutation to the Curated Corpus API to move the corpus item
 * from the approved to the rejected pile.
 *
 * @param props
 * @constructor
 */
export const RejectCorpusItemAction: React.FC<RejectCorpusItemActionProps> = (
  props
) => {
  const { item, actionScreen, toggleModal, modalOpen, refetch } = props;

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // 1. Prepare the "reject curated item" mutation
  const [rejectCuratedItem] = useRejectApprovedItemMutation();

  // 2. Remove the curated item from the recommendation corpus and place it
  // into the rejected item list.
  const onSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    // Set out all the variables we need to pass to the mutation
    const variables = {
      data: {
        externalId: item.externalId,
        reason: values.reason,
        actionScreen,
      },
    };

    // Run the mutation
    runMutation(
      rejectCuratedItem,
      { variables },
      `Item successfully moved to the rejected corpus.`,
      () => {
        toggleModal();
        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      },
      // If the data needs to be refreshed (as it does on the Corpus page),
      // run the `refetch` helper function provided by the parent component.
      refetch
    );
  };

  return (
    <RejectItemModal
      prospect={item}
      isOpen={modalOpen}
      onSave={onSave}
      toggleModal={toggleModal}
    />
  );
};
