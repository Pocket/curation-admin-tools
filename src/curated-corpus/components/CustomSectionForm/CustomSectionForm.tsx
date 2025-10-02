import React from 'react';
import { DateTime } from 'luxon';
import { Formik, Form, Field } from 'formik';
import { Box, TextField, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { CORPUS_IAB_CATEGORIES } from '../../../api/corpusIABCategories';
import { SharedFormButtons } from '../../../_shared/components';
import {
  getValidationSchema,
  CustomSectionFormData,
} from './CustomSectionForm.validation';

interface CustomSectionFormProps {
  initialValues?: Partial<CustomSectionFormData>;
  onSubmit: (values: CustomSectionFormData) => void | Promise<void>;
  onCancel?: () => void;
  submitButtonText?: string;
  isSubmitting?: boolean;
}

export const CustomSectionForm: React.FC<CustomSectionFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  submitButtonText = 'Create',
  isSubmitting = false,
}) => {
  // Get IAB categories for dropdown
  const iabCategories = Object.values(CORPUS_IAB_CATEGORIES['IAB-3.0'] || {})
    .filter((cat) => cat.parentId === null) // Get only top-level categories
    .map((cat) => ({
      value: cat.id,
      label: cat.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const defaultInitialValues: CustomSectionFormData = {
    title: '',
    subtitle: '',
    heroTitle: '',
    heroDescription: '',
    startDate: DateTime.now(),
    endDate: null,
    iabCategory: '',
  };

  const mergedInitialValues = {
    ...defaultInitialValues,
    ...initialValues,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Formik
        initialValues={mergedInitialValues}
        validationSchema={getValidationSchema()}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue, isValid }) => (
          <Form>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Field
                as={TextField}
                name="title"
                label="Title"
                required
                fullWidth
                error={touched.title && !!errors.title}
                helperText={touched.title && errors.title}
              />

              <Field
                as={TextField}
                name="subtitle"
                label="Subtitle"
                required
                fullWidth
                multiline
                rows={2}
                error={touched.subtitle && !!errors.subtitle}
                helperText={touched.subtitle && errors.subtitle}
              />

              <Field
                as={TextField}
                name="heroTitle"
                label="Hero Title (Optional)"
                fullWidth
                error={touched.heroTitle && !!errors.heroTitle}
                helperText={touched.heroTitle && errors.heroTitle}
              />

              <Field
                as={TextField}
                name="heroDescription"
                label="Hero Description (Optional)"
                fullWidth
                multiline
                rows={2}
                error={touched.heroDescription && !!errors.heroDescription}
                helperText={touched.heroDescription && errors.heroDescription}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={values.startDate}
                  onChange={(newValue) => setFieldValue('startDate', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={touched.startDate && !!errors.startDate}
                      helperText={touched.startDate && errors.startDate}
                      fullWidth
                    />
                  )}
                />

                <DatePicker
                  label="End Date (Optional)"
                  value={values.endDate}
                  onChange={(newValue) => setFieldValue('endDate', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={touched.endDate && !!errors.endDate}
                      helperText={touched.endDate && errors.endDate}
                      fullWidth
                    />
                  )}
                />
              </Box>

              <Field
                as={TextField}
                name="iabCategory"
                select
                label="IAB Category (Optional)"
                value={values.iabCategory || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue('iabCategory', e.target.value)
                }
                error={touched.iabCategory && !!errors.iabCategory}
                helperText={touched.iabCategory && errors.iabCategory}
                fullWidth
              >
                <MenuItem value="">Select a category</MenuItem>
                {iabCategories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Field>

              <SharedFormButtons
                onCancel={onCancel}
                saveButtonDisabled={!isValid || isSubmitting}
                saveButtonLabel={submitButtonText}
              />
            </Box>
          </Form>
        )}
      </Formik>
    </LocalizationProvider>
  );
};
