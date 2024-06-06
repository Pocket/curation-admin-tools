import React from 'react';
import { FormikHelpers, FormikValues } from 'formik';
import { DateTime } from 'luxon';
import {
  ActionScreen,
  ApprovedCorpusItem,
  CreateScheduledCorpusItemInput,
  ScheduledItemSource,
  useCreateScheduledCorpusItemMutation,
} from '../../../../api/generatedTypes';
import { useNotifications, useRunMutation } from '../../../../_shared/hooks';
import { ScheduleItemModal } from '../../';

interface ScheduleCorpusItemActionProps {
  /**
   * The approved item that is to be scheduled onto a surface.
   */
  item: ApprovedCorpusItem;

  /**
   * Indicates from which page the scheduling happened. (Analytics)
   */
  actionScreen: ActionScreen;

  /**
   * A state variable that tracks whether the ScheduleItemModal is visible
   * on the page or not.
   * This has to be passed down from the parent component as other components
   * may need to use it, too.
   */
  modalOpen: boolean;

  /**
   * A function that toggles the ScheduleItemModal's visibility on and off.
   * This has to be passed down from the parent component as other components
   * may need to use it.
   */
  toggleModal: VoidFunction;

  /**
   * A helper function from Apollo Client that triggers a new API call to refetch
   * the data for a given query.
   */
  refetch?: VoidFunction;
}

/**
 * This component encapsulates the logic needed to schedule a corpus item
 * onto a surface.
 *
 * @param props
 * @constructor
 */
export const ScheduleCorpusItemAction: React.FC<
  ScheduleCorpusItemActionProps
> = (props) => {
  const { item, actionScreen, toggleModal, modalOpen, refetch } = props;

  // set up the hook for toast notification
  const { showNotification } = useNotifications();

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // 1. Prepare the "schedule curated item" mutation
  const [scheduleCuratedItem] = useCreateScheduledCorpusItemMutation();

  const onSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ): void => {
    // DE items migrated from the old system don't have a topic.
    // This check forces to add a topic before scheduling
    // Although for this case, if an item is in the corpus already, we shouldn't
    // run into this since you need to add a Topic before you can save it to the corpus
    if (!item.topic) {
      showNotification('Cannot schedule item without topic', 'error');
      return;
    }
    // Set out all the variables we need to pass to the mutation
    const variables: CreateScheduledCorpusItemInput = {
      approvedItemExternalId: item.externalId,
      scheduledSurfaceGuid: values.scheduledSurfaceGuid,
      scheduledDate: values.scheduledDate.toISODate(),
      source: ScheduledItemSource.Manual,
      actionScreen,
    };
    // Run the mutation
    runMutation(
      scheduleCuratedItem,
      { variables },
      `Item scheduled successfully for ${values.scheduledDate
        .setLocale('en')
        .toLocaleString(DateTime.DATE_FULL)}.`,
      () => {
        toggleModal();
        formikHelpers.setSubmitting(false);

        if (refetch) {
          refetch();
        }
      },
      () => {
        formikHelpers.setSubmitting(false);
      },
    );
  };

  return (
    <ScheduleItemModal
      approvedItem={item}
      isOpen={modalOpen}
      onSave={onSave}
      toggleModal={toggleModal}
    />
  );
};
