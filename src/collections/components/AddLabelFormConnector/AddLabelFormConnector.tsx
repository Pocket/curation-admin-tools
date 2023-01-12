import React, { useState } from 'react';
import { useNotifications } from '../../../_shared/hooks';
import { AddLabelForm } from '../';
import { FormikHelpers, FormikValues } from 'formik';
import { Label, useCreateLabelMutation } from '../../../api/generatedTypes';

interface AddLabelFormConnectorProps {
  /**
   * Toggle the AddLabelFormConnectorProps to show/hide as necessary.
   */
  toggleModal: VoidFunction;

  /**
   * state variable for list of lables
   * */
  setLabelsList: React.Dispatch<React.SetStateAction<Label[]>>;
}

/**
 * Parent component for the AddLabelFormConnector component
 */
export const AddLabelFormConnector: React.FC<AddLabelFormConnectorProps> = (
  props
): JSX.Element => {
  const { toggleModal, setLabelsList } = props;
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
    <AddLabelForm
      onCancel={toggleModal}
      onSubmit={onSubmit}
      isLoaderShowing={isLoaderShowing}
    />
  );
};
