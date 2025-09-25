import * as yup from 'yup';
import { DateTime } from 'luxon';

export interface CustomSectionFormData {
  title: string;
  subtitle: string;
  heroTitle?: string;
  heroDescription?: string;
  startDate: DateTime | null;
  endDate: DateTime | null;
  iabCategory?: string;
}

export const getValidationSchema = () => {
  return yup.object({
    title: yup
      .string()
      .trim()
      .required('Title is required')
      .max(200, 'Title cannot exceed 200 characters'),

    subtitle: yup
      .string()
      .trim()
      .required('Subtitle is required')
      .max(500, 'Subtitle cannot exceed 500 characters'),

    heroTitle: yup
      .string()
      .trim()
      .max(200, 'Hero title cannot exceed 200 characters'),

    heroDescription: yup
      .string()
      .trim()
      .max(500, 'Hero description cannot exceed 500 characters'),

    startDate: yup.date().required('Start date is required').nullable(),

    endDate: yup
      .date()
      .nullable()
      .test(
        'is-after-start-date',
        'End date must be after start date',
        function (value) {
          const { startDate } = this.parent;
          if (!value || !startDate) {
            return true;
          }
          return value > startDate;
        },
      ),

    iabCategory: yup.string().trim(),
  });
};

export const validateForm = (
  formData: CustomSectionFormData,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!formData.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!formData.subtitle.trim()) {
    errors.subtitle = 'Subtitle is required';
  }

  if (!formData.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (
    formData.endDate &&
    formData.startDate &&
    formData.endDate <= formData.startDate
  ) {
    errors.endDate = 'End date must be after start date';
  }

  return errors;
};
