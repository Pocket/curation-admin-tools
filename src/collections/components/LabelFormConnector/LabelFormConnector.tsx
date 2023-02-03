import React, { useState } from 'react';
import { useRunMutation } from '../../../_shared/hooks';
import { LabelForm } from '../';
import { FormikHelpers, FormikValues } from 'formik';
import {
  useCreateLabelMutation,
  useUpdateLabelMutation,
  UpdateLabelInput,
  Label,
} from '../../../api/generatedTypes';

interface LabelFormConnectorProps {
  /**
   * Toggle the LabelFormConnectorProps to show/hide as necessary.
   */
  toggleModal: VoidFunction;

  /**
   * A helper function from Apollo Client that triggers a new API call to refetch
   * the data for a given query.
   */
  refetch: VoidFunction;

  /**
   * An object with everything label-related in it. It is optional because it is only
   * relevant when updating a label.
   */
  label?: Label;

  /**
   * Whether or not to run the createLabel mutation.
   */
  runCreateLabelMutation?: boolean;

  /**
   * Whether or not to run the updateLabel mutation.
   */
  runUpdateLabelMutation?: boolean;
}

/**
 * Parent component for the LabelForm component
 */
export const LabelFormConnector: React.FC<LabelFormConnectorProps> = (
  props
): JSX.Element => {
  const {
    toggleModal,
    refetch,
    label,
    runCreateLabelMutation,
    runUpdateLabelMutation,
  } = props;

  const [isLoaderShowing, setIsLoaderShowing] = useState<boolean>(false);
  const [createLabelMutation] = useCreateLabelMutation();
  const [updateLabelMutation] = useUpdateLabelMutation();

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  const onSubmit = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    // if runCreateLabelMutation flag is true, createLabel
    if (runCreateLabelMutation) {
      runMutation(
        createLabelMutation,
        { variables: { name: values.labelName } },
        `"${values.labelName} has been created"`,
        () => {
          setIsLoaderShowing(false);
          toggleModal();
          formikHelpers.setSubmitting(false);
        },
        () => {
          setIsLoaderShowing(false);
          formikHelpers.setSubmitting(false);
        },
        refetch
      );
    }
    // if runUpdateLabelMutation flag is true and label data is passed, updateLabel
    if (runUpdateLabelMutation && label) {
      // construct the updateLabel input
      const input: UpdateLabelInput = {
        externalId: label.externalId,
        name: values.labelName,
      };
      runMutation(
        updateLabelMutation,
        { variables: { data: input } },
        `updated to "${values.labelName}"`,
        () => {
          setIsLoaderShowing(false);
          toggleModal();
          formikHelpers.setSubmitting(false);
        },
        () => {
          setIsLoaderShowing(false);
          formikHelpers.setSubmitting(false);
        },
        refetch
      );
    }
    setIsLoaderShowing(true);
  };
  return (
    <LabelForm
      onCancel={toggleModal}
      onSubmit={onSubmit}
      isLoaderShowing={isLoaderShowing}
      label={label}
    />
  );
};
