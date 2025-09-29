import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  ActivitySource,
  CreateCustomSectionInput,
} from '../../../api/generatedTypes';
import { createCustomSection } from '../../../api/mutations/createCustomSection';
import { useRunMutation } from '../../../_shared/hooks';
import { CustomSectionForm } from '../';
import { CustomSectionFormData } from '../CustomSectionForm/CustomSectionForm.validation';

interface CustomSectionFormConnectorProps {
  scheduledSurfaceGuid: string;
  onSuccess?: (sectionId?: string) => void;
  onCancel?: () => void;
  initialValues?: Partial<CustomSectionFormData>;
}

export const CustomSectionFormConnector: React.FC<
  CustomSectionFormConnectorProps
> = ({ scheduledSurfaceGuid, onSuccess, onCancel, initialValues }) => {
  const history = useHistory();
  const { runMutation } = useRunMutation();
  const [createSectionMutation] = useMutation(createCustomSection);

  const handleSubmit = async (formValues: CustomSectionFormData) => {
    const input: CreateCustomSectionInput = {
      title: formValues.title.trim(),
      description: formValues.subtitle.trim(),
      heroTitle: formValues.heroTitle?.trim() || undefined,
      heroDescription: formValues.heroDescription?.trim() || undefined,
      startDate: formValues.startDate!.toFormat('yyyy-MM-dd'),
      endDate: formValues.endDate
        ? formValues.endDate.toFormat('yyyy-MM-dd')
        : undefined,
      scheduledSurfaceGuid,
      active: true,
      disabled: false,
      createSource: ActivitySource.Manual,
      ...(formValues.iabCategory && {
        iab: {
          taxonomy: 'IAB-3.0',
          categories: [formValues.iabCategory],
        },
      }),
    };

    await runMutation(
      createSectionMutation,
      {
        variables: {
          data: input,
        },
      },
      'Custom section created successfully',
      (data) => {
        const createdSection = data?.createCustomSection;

        // Navigate to the section details page
        if (createdSection?.externalId) {
          history.push(
            `/curated-corpus/custom-sections/${createdSection.externalId}/${scheduledSurfaceGuid}/`,
          );
        }

        if (onSuccess) {
          onSuccess(createdSection?.externalId);
        }
      },
      () => {
        // Error is already handled by runMutation
      },
    );
  };

  return (
    <CustomSectionForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitButtonText="Create Section"
    />
  );
};
