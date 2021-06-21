import React from 'react';
import { Box } from '@material-ui/core';
import { Button } from '../../Button/Button';

export interface SharedFormButtonsProps {
  /**
   * Do we need to show the cancel button? Not on the 'Add' page
   * True by default
   */
  editMode?: boolean;

  /**
   * What to do if the user clicks on the Cancel button
   */
  onCancel?: () => void;
}

export const SharedFormButtons: React.FC<SharedFormButtonsProps> = (
  props
): JSX.Element => {
  const { editMode = true, onCancel } = props;

  return (
    <>
      <Box display="flex" justifyContent="center">
        <Box p={1}>
          <Button buttonType="positive" type="submit">
            Save
          </Button>
        </Box>
        {editMode && (
          <Box p={1}>
            <Button buttonType="hollow-neutral" onClick={onCancel}>
              Cancel
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};
