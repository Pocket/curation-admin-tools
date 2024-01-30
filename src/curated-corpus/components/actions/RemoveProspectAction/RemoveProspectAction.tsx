import React from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { curationPalette } from '../../../../theme';
import {
  ProspectType,
  RemoveProspectInput,
  useRemoveProspectMutation,
} from '../../../../api/generatedTypes';
import { RemoveProspectModal } from '../../RemoveProspectModal/RemoveProspectModal';
import { FormikValues } from 'formik';

interface RemoveProspectActionProps {
  // sent by prospectListCard
  prospectId: string;

  // sent by prospectListCard
  prospectType?: string;

  // sent by prospectListCard
  prospectTitle?: string;
  /**
   * A state variable that tracks whether the RemoveProspectModal is visible
   * on the page or not.
   * This has to be passed down from the parent component as other components
   * may need to use it, too.
   */
  modalOpen?: boolean;

  /**
   * A function that toggles the RemoveProspectModal's visibility on and off.
   * This has to be passed down from the parent component as other components
   * may need to use it, too.
   */
  toggleModal?: VoidFunction;

  // sent by prospecting page
  onRemoveProspect: (prospectId: string, errorMessage?: string) => void;
}

/**
 * This component renders a cross (close) button and calls the removeProspect mutation
 * @param props
 * @returns
 */
export const RemoveProspectAction: React.FC<RemoveProspectActionProps> = (
  props
) => {
  let isProspectSlateScheduler = false;
  const {
    prospectId,
    prospectType,
    prospectTitle,
    modalOpen,
    toggleModal,
    onRemoveProspect,
  } = props;
  if (prospectType === ProspectType.SlateScheduler) {
    isProspectSlateScheduler = true;
  }

  const [removeProspect] = useRemoveProspectMutation();

  const runRemoveProspect = async (input: RemoveProspectInput) => {
    // call the removeProspect mutation function and only extract the errors object
    const { errors } = await removeProspect({
      variables: { data: input },
    });

    let errorMessage;

    if (errors?.length) {
      errorMessage = errors?.[0].message ?? 'Could not dismiss prospect';
    }

    // call the function that was passed in as a prop by the parents component
    onRemoveProspect(prospectId, errorMessage);
  };

  const onClick = async () => {
    const input: RemoveProspectInput = {
      id: prospectId,
    };
    await runRemoveProspect(input);
  };

  const removeProspectOnSave = async (values: FormikValues) => {
    const input: RemoveProspectInput = {
      id: prospectId,
      reasons: values.removalReason,
      reasonComment: values.otherReason,
    };
    await runRemoveProspect(input);
  };
  const removeProspectModal = async () => {
    if (!modalOpen && toggleModal) {
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
        prospectTitle={prospectTitle as string}
        isOpen={modalOpen as boolean}
        onSave={removeProspectOnSave}
        toggleModal={toggleModal as VoidFunction}
      />
    </IconButton>
  );
};
