import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { Modal } from '../../../_shared/components';
import { useNotifications } from '../../../_shared/hooks';
import { AddLabelForm } from '../';
import { FormikHelpers, FormikValues } from 'formik';
import { Label, useCreateLabelMutation } from '../../../api/generatedTypes';

interface AddLabelModalProps {
  /**
   * Whether the modal is visible on the screen or not.
   */
  isOpen: boolean;

  /**
   * Toggle the AddLabelModalProps to show/hide as necessary.
   */
  toggleModal: VoidFunction;

  /**
   * state variable from Parent component LabelList Page
   * */
  setLabelsList: React.Dispatch<React.SetStateAction<Label[]>>;
}

/**
 * Parent component for the AddProspectFormConnector component
 */
export const AddLabelModal: React.FC<AddLabelModalProps> = (
  props
): JSX.Element => {
  const { isOpen, toggleModal, setLabelsList } = props;
  const [isLoaderShowing, setIsLoaderShowing] = useState<boolean>(false);
  const [createLabelMutation] = useCreateLabelMutation();
  // Prepare state vars and helper methods for API notifications
  const { showNotification } = useNotifications();

  const onSubmit = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => {
    formikHelpers.setSubmitting(true);
    // call create label mutation
    createLabelMutation({
      variables: {
        name: values.labelName,
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
    })
      .then(({ data }) => {
        const createdLabelName = data?.createLabel.name;

        // hide the loading bar after this failed submission
        setIsLoaderShowing(false);

        if (data && createdLabelName) {
          // Hide the Add Label form
          toggleModal();

          // append the newly created label object to old array
          setLabelsList((prevState: Label[]) => {
            return [...prevState, data.createLabel];
          });
          showNotification(
            `"${data.createLabel.name} has been created"`,
            'success'
          );
          // Nothing else to do here - we can do an early exit
          return;
        }
      })
      .catch((error: Error) => {
        setIsLoaderShowing(false);
        showNotification(error.message, 'error');
      });
    setIsLoaderShowing(true);

    formikHelpers.resetForm();
  };
  return (
    <Modal open={isOpen} handleClose={toggleModal}>
      <Grid container direction="column">
        <Grid item>
          <h2>Add a New Label</h2>
        </Grid>
        <Grid item></Grid>
        <AddLabelForm
          onCancel={toggleModal}
          onSubmit={onSubmit}
          isLoaderShowing={isLoaderShowing}
        />
      </Grid>
    </Modal>
  );
};
