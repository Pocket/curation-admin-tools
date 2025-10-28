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

export const getValidationSchema = (isEditMode: boolean = false) => {
  const today = DateTime.now().startOf('day');

  return yup.object({
    title: yup
      .string()
      .trim()
      .required('Title is required')
      .max(200, 'Title cannot exceed 200 characters'),

    subtitle: yup
      .string()
      .trim()
      .max(500, 'Subtitle cannot exceed 500 characters'),

    heroTitle: yup
      .string()
      .trim()
      .max(200, 'Hero title cannot exceed 200 characters'),

    heroDescription: yup
      .string()
      .trim()
      .max(500, 'Hero description cannot exceed 500 characters'),

    startDate: yup
      .date()
      .required('Start date is required')
      .nullable()
      .test(
        'not-in-past',
        'Start date cannot be in the past',
        function (value) {
          // Always enforce start date validation, even in edit mode
          // This ensures scheduled or live sections always start on or after today
          if (!value) {
            return true;
          }
          const startDate = DateTime.fromJSDate(value).startOf('day');
          return startDate >= today;
        },
      ),

    endDate: yup
      .date()
      .nullable()
      .test('not-in-past', 'End date cannot be in the past', function (value) {
        // Always enforce end date validation, even in edit mode
        if (!value) {
          return true;
        }
        const endDate = DateTime.fromJSDate(value).startOf('day');
        return endDate >= today;
      })
      .test(
        'is-on-or-after-start-date',
        'End date must be on or after start date',
        function (value) {
          const { startDate } = this.parent;
          if (!value || !startDate) {
            return true;
          }
          const endDateTime = DateTime.fromJSDate(value).startOf('day');
          const startDateTime = DateTime.fromJSDate(startDate).startOf('day');
          // Allow end date to be on the same day as start date
          return endDateTime >= startDateTime;
        },
      ),

    iabCategory: yup.string().trim(),
  });
};

export const validateForm = (
  formData: CustomSectionFormData,
): Record<string, string> => {
  const errors: Record<string, string> = {};
  const today = DateTime.now().startOf('day');

  if (!formData.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!formData.startDate) {
    errors.startDate = 'Start date is required';
  } else if (formData.startDate < today) {
    errors.startDate = 'Start date cannot be in the past';
  }

  if (formData.endDate) {
    if (formData.endDate < today) {
      errors.endDate = 'End date cannot be in the past';
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      errors.endDate = 'End date must be on or after start date';
    }
  }

  return errors;
};
