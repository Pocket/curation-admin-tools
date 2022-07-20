import React from 'react';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { Box, Grid, Typography } from '@material-ui/core';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { Modal } from '../../../_shared/components';
import { ScheduleItemFormConnector } from '../';

interface ScheduleItemModalProps {
  /**
   * The approved corpus item the impending scheduling action is meant for.
   */
  approvedItem: ApprovedCorpusItem;

  /**
   * The copy that shows up at the top of the schedule item modal. This is different
   * depending on which screen the modal is initiated from.
   */
  headingCopy?: string;

  /**
   * Whether the modal is visible or not.
   */
  isOpen: boolean;

  /**
   * The scheduled surface GUID that should be selected, if provided
   */
  scheduledSurfaceGuid?: string;

  /**
   * Whether to lock the scheduled surface dropdown to just the value sent through
   * in the `scheduledSurfaceGuid` variable.
   */
  disableScheduledSurface?: boolean;

  /**
   * The action to run when the user hits the "Save" button at the bottom of the modal.
   * @param values
   * @param formikHelpers
   */
  onSave: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;

  /**
   * A helper function that toggles the visibility of the modal on and off.
   */
  toggleModal: VoidFunction;
}

/**
 * This modal opens a form that allows the curators to schedule corpus items
 * onto Firefox New Tab and other surfaces.
 *
 * @param props
 * @constructor
 */
export const ScheduleItemModal: React.FC<ScheduleItemModalProps> = (
  props
): JSX.Element => {
  const {
    approvedItem,
    disableScheduledSurface,
    headingCopy = 'Schedule this item',
    isOpen,
    scheduledSurfaceGuid,
    onSave,
    toggleModal,
  } = props;

  return (
    <Modal
      open={isOpen}
      handleClose={() => {
        toggleModal();
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h2>{headingCopy}</h2>
          <Box mb={3}>
            <Typography variant="subtitle1">
              <em>Title</em>: {approvedItem.title}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ScheduleItemFormConnector
            approvedItemExternalId={approvedItem.externalId}
            scheduledSurfaceGuid={scheduledSurfaceGuid}
            disableScheduledSurface={disableScheduledSurface}
            onSubmit={onSave}
            onCancel={() => {
              toggleModal();
            }}
          />
        </Grid>
      </Grid>
    </Modal>
  );
};
