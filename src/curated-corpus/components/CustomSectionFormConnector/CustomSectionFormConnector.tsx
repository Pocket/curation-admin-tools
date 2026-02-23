import React from 'react';
import { DateTime } from 'luxon';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  ActivitySource,
  CreateCustomSectionInput,
  UpdateCustomSectionInput,
  Section,
} from '../../../api/generatedTypes';
import { createCustomSection } from '../../../api/mutations/createCustomSection';
import { updateCustomSection } from '../../../api/mutations/updateCustomSection';
import { deleteCustomSection } from '../../../api/mutations/deleteCustomSection';
import { useRunMutation } from '../../../_shared/hooks';
import { CustomSectionForm } from '../';
import { CustomSectionFormData } from '../CustomSectionForm/CustomSectionForm.validation';

interface CustomSectionFormConnectorProps {
  scheduledSurfaceGuid: string;
  onSuccess?: (sectionId?: string) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  initialValues?: Partial<CustomSectionFormData>;
  existingSection?: Section;
  isEditMode?: boolean;
}

export const CustomSectionFormConnector: React.FC<
  CustomSectionFormConnectorProps
> = ({
  scheduledSurfaceGuid,
  onSuccess,
  onCancel,
  onDelete,
  initialValues,
  existingSection,
  isEditMode = false,
}) => {
  const history = useHistory();
  const { runMutation } = useRunMutation();
  const [createSectionMutation] = useMutation(createCustomSection);
  const [updateSectionMutation] = useMutation(updateCustomSection);
  const [deleteSectionMutation] = useMutation(deleteCustomSection);

  const handleSubmit = async (formValues: CustomSectionFormData) => {
    if (isEditMode && existingSection) {
      // Update existing section
      const input: UpdateCustomSectionInput = {
        externalId: existingSection.externalId,
        title: formValues.title.trim(),
        description: formValues.subtitle.trim() || '', // Ensure it's never undefined
        heroTitle: formValues.heroTitle?.trim() || undefined,
        heroDescription: formValues.heroDescription?.trim() || undefined,
        startDate: formValues.startDate!.toFormat('yyyy-MM-dd'),
        endDate: formValues.endDate
          ? formValues.endDate.toFormat('yyyy-MM-dd')
          : undefined,
        updateSource: ActivitySource.Manual, // Add required updateSource field
        followable: formValues.followable,
        allowAds: formValues.allowAds,
        ...(formValues.iabCategory && {
          iab: {
            taxonomy: 'IAB-3.0',
            categories: [formValues.iabCategory],
          },
        }),
      };

      await runMutation(
        updateSectionMutation,
        {
          variables: {
            data: input,
          },
        },
        'Custom section updated successfully',
        (data) => {
          if (onSuccess) {
            onSuccess(existingSection.externalId);
          }
        },
        () => {
          // Error is already handled by runMutation
        },
      );
    } else {
      // Create new section
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
        followable: formValues.followable,
        allowAds: formValues.allowAds,
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
    }
  };

  const handleDelete = async () => {
    if (!existingSection) return;

    // The parent component (EditCustomSectionModal) will handle showing the confirmation dialog
    // and call this function when confirmed
    await runMutation(
      deleteSectionMutation,
      {
        variables: {
          externalId: existingSection.externalId,
        },
      },
      'Custom section deleted successfully',
      () => {
        history.push(`/curated-corpus/custom-sections/`);
        if (onDelete) {
          onDelete();
        }
      },
      () => {
        // Error is already handled by runMutation
      },
    );
  };

  // Prepare initial values for edit mode
  const formInitialValues =
    isEditMode && existingSection
      ? {
          title: existingSection.title,
          subtitle: existingSection.description || '',
          heroTitle: existingSection.heroTitle || '',
          heroDescription: existingSection.heroDescription || '',
          startDate: existingSection.startDate
            ? DateTime.fromISO(existingSection.startDate)
            : DateTime.now(),
          endDate: existingSection.endDate
            ? DateTime.fromISO(existingSection.endDate)
            : null,
          iabCategory: existingSection.iab?.categories?.[0] || '',
          followable: existingSection.followable,
          allowAds: existingSection.allowAds,
        }
      : initialValues;

  return (
    <CustomSectionForm
      initialValues={formInitialValues}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      onDelete={isEditMode ? handleDelete : undefined}
      submitButtonText={isEditMode ? 'Update Section' : 'Create Section'}
      isEditMode={isEditMode}
    />
  );
};
