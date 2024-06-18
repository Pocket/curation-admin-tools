import React from 'react';
import { FormikHelpers, FormikValues } from 'formik';
import {
  ActionScreen,
  DeleteScheduledCorpusItemInput,
  RejectApprovedCorpusItemInput,
  ScheduledCorpusItem,
  useDeleteScheduledItemMutation,
  useRejectApprovedItemMutation,
} from '../../../../api/generatedTypes';
import { useRunMutation } from '../../../../_shared/hooks';
import { RejectItemModal } from '../../';

interface RejectAndUnscheduleItemActionProps {
  /**
   * The scheduled item that is about to be rejected and unscheduled in one go.
   */
  item: ScheduledCorpusItem;

  /**
   * Indicate on which screen the action was performed.
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
export const RejectAndUnscheduleItemAction: React.FC<
  RejectAndUnscheduleItemActionProps
> = (props) => {
  const { item, actionScreen, toggleModal, modalOpen, refetch } = props;

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // Prepare the "reject curated item" mutation
  const [rejectCuratedItem] = useRejectApprovedItemMutation();

  // Prepare the "delete scheduled item" mutation
  const [deleteScheduledItem] = useDeleteScheduledItemMutation();

  // 2. Remove the curated item from the recommendation corpus and place it
  // into the rejected item list.
  const onSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ): void => {
    // Set up all the variables we need to pass to the unschedule mutation
    const unscheduleInput: DeleteScheduledCorpusItemInput = {
      externalId: item.externalId as string,
      actionScreen,
    };

    // Set out all the variables we need to pass to the reject mutation
    const rejectInput: RejectApprovedCorpusItemInput = {
      externalId: item.approvedItem!.externalId,
      reason: values.reason,
      actionScreen,
    };

    // First unschedule the item, otherwise the rejection will fail
    runMutation(
      deleteScheduledItem,
      { variables: { data: unscheduleInput } },
      `Item unscheduled successfully.`,
      () => {
        // On success, move the approved item from the corpus to the rejected pile
        runMutation(
          rejectCuratedItem,
          { variables: { data: rejectInput } },
          `Item successfully moved to the rejected corpus.`,
          () => {
            toggleModal();
            formikHelpers.setSubmitting(false);
          },
          () => {
            formikHelpers.setSubmitting(false);
          },
          // If the data needs to be refreshed (as it does on the Schedule page),
          // run the `refetch` helper function provided by the parent component.
          refetch,
        );
      },
      () => {
        formikHelpers.setSubmitting(false);
      },
    );
  };

  return (
    <RejectItemModal
      prospect={item.approvedItem}
      isOpen={modalOpen}
      onSave={onSave}
      toggleModal={toggleModal}
    />
  );
};
