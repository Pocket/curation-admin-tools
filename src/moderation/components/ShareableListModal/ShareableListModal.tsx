import React from 'react';
import { Grid } from '@mui/material';
import { Modal } from '../../../_shared/components';
import { ShareableListFormConnector } from '../';
import { ShareableListComplete } from '../../../api/generatedTypes';

interface ShareableListsModalProps {
  /**
   * Whether the modal is visible on the screen or not.
   */
  isOpen: boolean;

  /**
   * Toggle the ShareableListsModalProps to show/hide as necessary.
   */
  toggleModal: VoidFunction;

  /**
   * ShareableLists Modal custom title.
   */
  modalTitle: string;

  /**
   * A helper function from Apollo Client that triggers a new API call to refetch
   * the data for a given query.
   */
  refetch: VoidFunction;

  /**
   * An object with everything shareableList-related in it.
   */
  shareableList: ShareableListComplete;

  /**
   * Whether or not to run the moderateShareableList mutation (for hiding list).
   */
  hideList?: boolean;

  /**
   * Whether or not to run the moderateShareableList mutation (for restoring list).
   */
  restoreList?: boolean;
}

/**
 * Parent component for the LabelModal component
 */
export const ShareableListModal: React.FC<ShareableListsModalProps> = (
  props
): JSX.Element => {
  const {
    isOpen,
    toggleModal,
    modalTitle,
    refetch,
    shareableList,
    hideList,
    restoreList,
  } = props;

  return (
    <Modal open={isOpen} handleClose={toggleModal}>
      <Grid container direction="column">
        <Grid item>
          <h2>{modalTitle}</h2>
        </Grid>
        <Grid item></Grid>
        <ShareableListFormConnector
          toggleModal={toggleModal}
          refetch={refetch}
          shareableList={shareableList}
          hideList={hideList}
          restoreList={restoreList}
        />
      </Grid>
    </Modal>
  );
};
