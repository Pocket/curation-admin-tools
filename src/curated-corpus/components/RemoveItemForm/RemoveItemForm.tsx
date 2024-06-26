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
  FormikTextField,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { RemovalReason } from '../../../api/generatedTypes';
import { formatFormLabel } from '../../helpers/helperFunctions';
import { validationSchema } from './RemoveItemForm.validation';
import { useToggle } from '../../../_shared/hooks';

interface RemoveItemFormProps {
  /**
   * What do we do with the submitted data?
   */
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ) => void | Promise<any>;
}

export const RemoveItemForm: React.FC<
  RemoveItemFormProps & SharedFormButtonsProps
> = (props): JSX.Element => {
  const { onCancel, onSubmit } = props;
  // whether the "Other" checkbox is selected, this will give us
  // an indication if the reason comment field should be enabled or disabled
  const [isOtherSelected, setOtherReason] = useToggle(false);
  const formik = useFormik({
    initialValues: {
      [RemovalReason.ArticleQuality]: false,
      [RemovalReason.Commercial]: false,
      [RemovalReason.Controversial]: false,
      [RemovalReason.HedDekQuality]: false,
      [RemovalReason.ImageQuality]: false,
      [RemovalReason.Niche]: false,
      [RemovalReason.NoImage]: false,
      [RemovalReason.OneSided]: false,
      [RemovalReason.Partisan]: false,
      [RemovalReason.Paywall]: false,
      [RemovalReason.PublisherDiversity]: false,
      [RemovalReason.PublisherQuality]: false,
      [RemovalReason.PublishDate]: false,
      [RemovalReason.SetDiversity]: false,
      [RemovalReason.TimeSensitive]: false,
      [RemovalReason.TopicDiversity]: false,
      OTHER: false,
      removalReason: '',
      reasonComment: '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      // Populate the 'removalReason' field value with a comma-separated list
      // of removal reasons.
      const removalReasons: string[] = [];
      for (const [key, value] of Object.entries(values)) {
        if (value === true) {
          removalReasons.push(key);
        }
      }
      values.removalReason = removalReasons.join(',');

      // Send the values along to the parent function call that will run the mutation
      onSubmit(values, formikHelpers);
    },
  });
  // update "Other" checkbox status
  const handleOtherCheckbox = () => {
    setOtherReason();
  };
  return (
    <form name="reject-item-form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormGroup>
            {Object.values(RemovalReason)
              .slice(0, 8) // first 8 reasons in first column
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
            {Object.values(RemovalReason)
              .slice(8, 16) // remaining 8 reasons in second column
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
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  {...formik.getFieldProps({
                    name: 'OTHER',
                  })}
                  // onChange doesn't always work, onClick does the job
                  onClick={handleOtherCheckbox}
                />
              }
              label="OTHER"
            />
            <FormikTextField
              disabled={!isOtherSelected}
              id="reasonComment"
              label="Reason Comment"
              fieldProps={formik.getFieldProps('reasonComment')}
              fieldMeta={formik.getFieldMeta('reasonComment')}
              autoFocus
              multiline
              minRows={1}
            />
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
        {formik.errors && formik.errors.removalReason && (
          <FormHelperText error>{formik.errors.removalReason}</FormHelperText>
        )}
      </Box>

      <SharedFormButtons onCancel={onCancel} />
    </form>
  );
};
