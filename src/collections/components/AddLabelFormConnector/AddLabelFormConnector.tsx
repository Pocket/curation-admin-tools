import React, { useState } from 'react';
import { useRunMutation } from '../../../_shared/hooks';
import { AddLabelForm } from '../';
import { FormikHelpers, FormikValues } from 'formik';
import { useCreateLabelMutation } from '../../../api/generatedTypes';

interface AddLabelFormConnectorProps {
  /**
   * Toggle the AddLabelFormConnectorProps to show/hide as necessary.
   */
  toggleModal: VoidFunction;

  /**
   * A helper function from Apollo Client that triggers a new API call to refetch
   * the data for a given query.
   */
  refetch: VoidFunction;
}

/**
 * Parent component for the AddLabelForm component
 */
export const AddLabelFormConnector: React.FC<AddLabelFormConnectorProps> = (
  props
): JSX.Element => {
  const { toggleModal, refetch } = props;
  const [isLoaderShowing, setIsLoaderShowing] = useState<boolean>(false);
  const [createLabelMutation] = useCreateLabelMutation();

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  const onSubmit = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    // Run the mutation
    runMutation(
      createLabelMutation,
      { variables: { name: values.labelName } },
      `"${values.labelName} has been created"`,
      () => {
        setIsLoaderShowing(false);
        toggleModal();
        formikHelpers.setSubmitting(false);

        if (refetch) {
          refetch();
        }
      },
      () => {
        setIsLoaderShowing(false);
        formikHelpers.setSubmitting(false);
      }
    );
    setIsLoaderShowing(true);
  };
  return (
    <AddLabelForm
      onCancel={toggleModal}
      onSubmit={onSubmit}
      isLoaderShowing={isLoaderShowing}
    />
  );
};
