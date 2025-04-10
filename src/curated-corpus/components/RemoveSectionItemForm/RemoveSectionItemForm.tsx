import React from 'react';
import { FormikHelpers, FormikValues, useFormik } from 'formik';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { SectionItemRemovalReason } from '../../../api/generatedTypes';
import { formatFormLabel } from '../../helpers/helperFunctions';
import { validationSchema } from './RemoveSectionItemForm.validation';

interface RemoveSectionItemFormProps {
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ) => void | Promise<any>;
}

export const RemoveSectionItemForm: React.FC<
  RemoveSectionItemFormProps & SharedFormButtonsProps
> = (props): JSX.Element => {
  const { onCancel, onSubmit } = props;
  const formik = useFormik({
    initialValues: {
      [SectionItemRemovalReason.ArticleQuality]: false,
      [SectionItemRemovalReason.Controversial]: false,
      [SectionItemRemovalReason.Dated]: false,
      [SectionItemRemovalReason.HedDekQuality]: false,
      [SectionItemRemovalReason.ImageQuality]: false,
      [SectionItemRemovalReason.NoImage]: false,
      [SectionItemRemovalReason.OffTopic]: false,
      [SectionItemRemovalReason.OneSided]: false,
      [SectionItemRemovalReason.Paywall]: false,
      [SectionItemRemovalReason.PublisherQuality]: false,
      [SectionItemRemovalReason.SetDiversity]: false,
      [SectionItemRemovalReason.Other]: false,
      removalReasons: [] as string[],
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      // Populate the 'values.removalReasons' array
      // with selected removal reasons
      values.removalReasons = Object.entries(values)
        .filter(([key, value]) => value === true)
        .map(([key]) => key);
      // Send the values along to the parent function call that will run the mutation
      onSubmit(values, formikHelpers);
    },
  });
  return (
    <form name="remove-section-item-form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormGroup>
            {Object.values(SectionItemRemovalReason)
              .slice(0, 6) // first 6 reasons in first column (12 reasons total)
              .map((value) => {
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        {...formik.getFieldProps({
                          name: value,
                        })}
                      />
                    }
                    label={formatFormLabel(value)}
                    key={value}
                  />
                );
              })}
          </FormGroup>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormGroup>
            {Object.values(SectionItemRemovalReason)
              .slice(6, 12) // remaining 6 reasons in second column
              .map((value) => {
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        {...formik.getFieldProps({
                          name: value,
                        })}
                      />
                    }
                    label={formatFormLabel(value)}
                    key={value}
                  />
                );
              })}
          </FormGroup>
        </Grid>

        {formik.isSubmitting && (
          <Grid item xs={12}>
            <Box mb={3}>
              <LinearProgress />
            </Box>
          </Grid>
        )}
      </Grid>
      <Box mb={2}>
        {formik.errors && formik.errors.removalReasons && (
          <FormHelperText error>{formik.errors.removalReasons}</FormHelperText>
        )}
      </Box>

      <SharedFormButtons onCancel={onCancel} />
    </form>
  );
};
