import React from 'react';
import { useDismissProspectMutation } from '../../../../api/generatedTypes';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useStyles } from './DismissProspectAction.styles';

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
  const classes = useStyles();
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
      className={classes.dismissButton}
      onClick={onClick}
      data-testid="dismissButton"
    >
      <CloseIcon fontSize="medium" />
    </IconButton>
  );
};
