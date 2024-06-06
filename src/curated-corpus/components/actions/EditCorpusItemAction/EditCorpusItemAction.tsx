import React from 'react';
import { FormikHelpers, FormikValues } from 'formik';
import {
  ActionScreen,
  ApprovedCorpusItem,
  useUpdateApprovedCorpusItemMutation,
} from '../../../../api/generatedTypes';
import { useRunMutation } from '../../../../_shared/hooks';
import { transformAuthors } from '../../../../_shared/utils/transformAuthors';
import { ApprovedItemModal } from '../../';

interface EditCorpusItemActionProps {
  /**
   * The approved item that is about to become a rejected item instead.
   */
  item: ApprovedCorpusItem;

  /**
   * Indicates from which page the edit happened. (Analytics)
   */
  actionScreen: ActionScreen;

  /**
   * A state variable that tracks whether the ApprovedIteModal is visible
   * on the page or not.
   * This has to be passed down from the parent component as other components
   * may need to use it, too.
   */
  modalOpen: boolean;

  /**
   * A function that toggles the ApprovedItemModal's visibility on and off.
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
 * This component encapsulates the logic needed to edit a corpus item's data
 *
 * @param props
 * @constructor
 */
export const EditCorpusItemAction: React.FC<EditCorpusItemActionProps> = (
  props,
) => {
  const { item, actionScreen, toggleModal, modalOpen, refetch } = props;

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // 1. Prepare the "update curated item" mutation
  const [updateCorpusItem] = useUpdateApprovedCorpusItemMutation();

  // 2. Update the curated item with the data the curator submitted in the edit form.
  const onSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ): void => {
    const variables = {
      data: {
        externalId: item.externalId,
        title: values.title,
        excerpt: values.excerpt,
        status: values.curationStatus,
        language: values.language,
        authors: transformAuthors(values.authors),
        publisher: values.publisher,
        datePublished: values.datePublished,
        imageUrl: values.imageUrl,
        topic: values.topic,
        isTimeSensitive: values.timeSensitive,
        actionScreen,
      },
    };

    // Executed the mutation to update the approved item
    runMutation(
      updateCorpusItem,
      { variables },
      `Curated item "${item.title.substring(0, 40)}..." successfully updated`,
      () => {
        toggleModal();
        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      },
      refetch,
    );
  };

  return (
    <ApprovedItemModal
      approvedItem={item}
      heading="Edit Item"
      showItemTitle={true}
      isOpen={modalOpen}
      onSave={onSave}
      toggleModal={toggleModal}
    />
  );
};
