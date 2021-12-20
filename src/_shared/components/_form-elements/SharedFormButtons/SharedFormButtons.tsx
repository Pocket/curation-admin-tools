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
   * Optional prop to disable the save button on a form/on this component
   */
  saveButtonDisabled?: boolean;
  /**
   * The default for the shared buttons is "Save", but sometimes another
   * call to action is appropriate, e.g. "Confirm".
   */

  saveButtonLabel?: string;
  /**
   * What to do if the user clicks on the Cancel button
   */
  onCancel?: () => void;

  /**
   * Function to call if the user clicks on the Save button - optional,
   * in most cases this would be handled by the onSubmit function in
   * the form itself
   */
  onSave?: () => void;
}

export const SharedFormButtons: React.FC<SharedFormButtonsProps> = (
  props
): JSX.Element => {
  const {
    editMode = true,
    saveButtonDisabled = false,
    saveButtonLabel = 'Save',
    onCancel,
    onSave,
  } = props;

  return (
    <>
      <Box display="flex" justifyContent="center">
        <Box p={1}>
          <Button
            buttonType="positive"
            type="submit"
            onClick={onSave}
            disabled={saveButtonDisabled}
          >
            {saveButtonLabel}
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
