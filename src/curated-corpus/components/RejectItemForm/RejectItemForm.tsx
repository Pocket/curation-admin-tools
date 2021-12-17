import React from 'react';
import { FormikHelpers, FormikValues, useFormik } from 'formik';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
} from '@material-ui/core';
import {
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { validationSchema } from './RejectItemForm.validation';
import { RejectionReason } from '../../api/curated-corpus-api/generatedTypes';

interface RejectItemFormProps {
  /**
   * What do we do with the submitted data?
   */
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
}

export const RejectItemForm: React.FC<
  RejectItemFormProps & SharedFormButtonsProps
> = (props): JSX.Element => {
  const { onCancel, onSubmit } = props;

  const formik = useFormik({
    initialValues: {
      [RejectionReason.Paywall]: false,
      [RejectionReason.PoliticalOpinion]: false,
      [RejectionReason.OffensiveMaterial]: false,
      [RejectionReason.TimeSensitive]: false,
      [RejectionReason.Misinformation]: false,
      [RejectionReason.Other]: false,
      reason: '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      // Populate the 'reason' field value with a comma-separated list
      // of rejection reasons.
      const rejectionReasons: string[] = [];
      for (const [key, value] of Object.entries(values)) {
        if (value === true) {
          rejectionReasons.push(key);
        }
      }
      values.reason = rejectionReasons.join(',');

      // Send the values along to the parent function call that will run the mutation
      onSubmit(values, formikHelpers);
    },
  });
  return (
    <form name="reject-item-form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  {...formik.getFieldProps({
                    name: RejectionReason.Paywall,
                  })}
                />
              }
              label="Paywall"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  {...formik.getFieldProps({
                    name: RejectionReason.PoliticalOpinion,
                  })}
                />
              }
              label="Partisan/Political opinion"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  {...formik.getFieldProps({
                    name: RejectionReason.OffensiveMaterial,
                  })}
                />
              }
              label="Offensive material"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  {...formik.getFieldProps({
                    name: RejectionReason.TimeSensitive,
                  })}
                />
              }
              label="Time sensitive"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  {...formik.getFieldProps({
                    name: RejectionReason.Misinformation,
                  })}
                />
              }
              label="Misinformation"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  {...formik.getFieldProps({
                    name: RejectionReason.Other,
                  })}
                />
              }
              label="Other"
            />
          </FormGroup>
        </Grid>
      </Grid>
      <Box mb={2}>
        {formik.errors && formik.errors.reason && (
          <FormHelperText error>{formik.errors.reason}</FormHelperText>
        )}
      </Box>
      <SharedFormButtons onCancel={onCancel} />
    </form>
  );
};
