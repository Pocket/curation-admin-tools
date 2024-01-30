import React from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { curationPalette } from '../../../../theme';
import {
  ProspectType,
  RemoveProspectInput,
  useDismissProspectMutation,
  useRemoveProspectMutation,
} from '../../../../api/generatedTypes';
import { RemoveProspectModal } from '../../RemoveProspectModal/RemoveProspectModal';
import { FormikHelpers, FormikValues } from 'formik';

interface DismissProspectActionProps {
  // sent by prospectListCard
  prospectId: string;

  // sent by prospectListCard
  prospectType: string;

  // sent by prospectListCard
  prospectTitle: string;
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

  // sent by prospecting page
  onDismissProspect: (prospectId: string, errorMessage?: string) => void;
}

/**
 * This component renders a cross (close) button and calls the dismissProspect mutation
 * @param props
 * @returns
 */
export const DismissProspectAction: React.FC<DismissProspectActionProps> = (
  props
) => {
  let isProspectSlateScheduler = false;
  const {
    prospectId,
    prospectType,
    prospectTitle,
    modalOpen,
    toggleModal,
    onDismissProspect,
  } = props;
  if (prospectType === ProspectType.SlateScheduler) {
    isProspectSlateScheduler = true;
  }

  const [dismissProspect] = useDismissProspectMutation();
  const [removeProspect] = useRemoveProspectMutation();

  const onClick = async () => {
    // call the dismissProspect mutation function and only extract the errors object
    const { errors } = await dismissProspect({
      variables: { id: prospectId },
    });

    let errorMessage;

    if (errors?.length) {
      errorMessage = errors?.[0].message ?? 'Could not dismiss prospect';
    }

    // call the function that was passed in as a prop by the parents component
    onDismissProspect(prospectId, errorMessage);
  };

  const removeProspectOnSave = async (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => {
    console.log('prospectId: ', prospectId);
    console.log('prospectTitle: ', prospectTitle);
    console.log('removalReason: ', values.removalReason);
    console.log('otherReason: ', values.otherReason);
    const input: RemoveProspectInput = {
      id: prospectId,
      reasons: values.removalReason,
      reasonComment: values.otherReason,
    };
    // call the removeProspect mutation function and only extract the errors object
    const { errors } = await removeProspect({
      variables: { data: input },
    });

    let errorMessage;

    if (errors?.length) {
      errorMessage = errors?.[0].message ?? 'Could not dismiss prospect';
    }

    // call the function that was passed in as a prop by the parents component
    onDismissProspect(prospectId, errorMessage);
  };
  const removeProspectModal = async () => {
    console.log('removeProspectModal');
    if (!modalOpen) {
      toggleModal();
    }
  };
  return (
    <IconButton
      onClick={isProspectSlateScheduler ? removeProspectModal : onClick}
      data-testid="dismissButton"
      sx={{
        color: curationPalette.secondary,
        marginRight: '-1rem',
        padding: '0.25rem',
      }}
    >
      <CloseIcon fontSize="medium" />
      <RemoveProspectModal
        prospectTitle={prospectTitle}
        isOpen={modalOpen}
        onSave={removeProspectOnSave}
        toggleModal={toggleModal}
      />
    </IconButton>
  );
};
