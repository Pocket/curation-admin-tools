import React from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { curationPalette } from '../../../../theme';
import { useDismissProspectMutation } from '../../../../api/generatedTypes';

interface DismissProspectActionProps {
  // sent by prospectListCard
  prospectId: string;

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
  const { prospectId, onDismissProspect } = props;

  const [dismissProspect] = useDismissProspectMutation();

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

  return (
    <IconButton
      onClick={onClick}
      data-testid="dismissButton"
      sx={{
        color: curationPalette.secondary,
        marginRight: '-1rem',
        padding: '0.25rem',
      }}
    >
      <CloseIcon fontSize="medium" />
    </IconButton>
  );
};
