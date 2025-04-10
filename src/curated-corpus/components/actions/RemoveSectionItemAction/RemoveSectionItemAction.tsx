import React from 'react';
import { FormikHelpers, FormikValues } from 'formik';
import {
  SectionItem,
  useRemoveSectionItemMutation,
} from '../../../../api/generatedTypes';
import { useRunMutation } from '../../../../_shared/hooks';
import { RemoveSectionItemModal } from '../../';

interface RemoveSectionItemActionProps {
  /**
   * The section item that is about to be removed.
   */
  sectionItem: SectionItem;

  /**
   * A state variable that tracks whether the RemoveSectionItemModal is visible
   * on the page or not.
   */
  modalOpen: boolean;

  /**
   * A function that toggles the RemoveSectionItemModal's visibility on and off.
   */
  toggleModal: VoidFunction;

  /**
   * A function that triggers a new API call to refetch the data for a given
   * query.
   */
  refetch?: VoidFunction;
}

/**
 * This component encapsulates the logic needed to remove a Section Item.
 *
 * @param props
 * @constructor
 */
export const RemoveSectionItemAction: React.FC<RemoveSectionItemActionProps> = (
  props,
) => {
  const { sectionItem, toggleModal, modalOpen, refetch } = props;

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // Prepare the removeSectionItem mutation
  const [removeSectionItemMutation] = useRemoveSectionItemMutation();

  const onSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ): void => {
    // Run the mutation
    runMutation(
      removeSectionItemMutation,
      {
        variables: {
          data: {
            externalId: sectionItem.externalId,
            deactivateReasons: values.removalReasons,
          },
        },
      },
      `Item removed successfully.`,
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
    <RemoveSectionItemModal
      itemTitle={sectionItem.approvedItem.title}
      isOpen={modalOpen}
      onSave={onSave}
      toggleModal={toggleModal}
    />
  );
};
