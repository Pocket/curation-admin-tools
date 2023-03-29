import React from 'react';
import { Grid, LinearProgress } from '@mui/material';
import { FormikHelpers, FormikValues, useFormik } from 'formik';
import {
  FormikSelectField,
  FormikTextField,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { ShareableListComplete } from '../../../api/generatedTypes';
import {
  DropdownOption,
  hideShareableListModerationReasonOptions,
} from '../../helpers/definitions';
import { validationSchema } from './ShareableListModerationForm.validation';

interface ShareableListModerationFormProps {
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;

  /**
   * Show/hide the loading bar on submissions
   */
  isLoaderShowing: boolean;

  /**
   * An object with everything shareableList-related in it.
   */
  shareableList: ShareableListComplete;
}

/**
 * This component houses all the logic and data that will be used in this form.
 */
export const ShareableListModerationForm: React.FC<
  ShareableListModerationFormProps & SharedFormButtonsProps
> = (props) => {
  // de-structure props
  const { onCancel, onSubmit, isLoaderShowing, shareableList } = props;

  // set up formik object for this form
  const formik = useFormik({
    initialValues: {
      moderationReason: shareableList.moderationReason ?? '',
      moderationDetails: shareableList.moderationDetails ?? '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit,
  });

  return (
    <form name="moderate-shareable-list-form" onSubmit={formik.handleSubmit}>
      <Grid
        container
        spacing={2}
        sx={{
          width: {
            sm: '100%',
            md: 800,
          },
        }}
      >
        <Grid item xs={12}>
          <FormikSelectField
            id="moderationReason"
            label="Moderation Reason"
            fieldProps={formik.getFieldProps('moderationReason')}
            fieldMeta={formik.getFieldMeta('moderationReason')}
          >
            <option aria-label="None" value="" />
            {hideShareableListModerationReasonOptions.map(
              (modReasonOpt: DropdownOption) => {
                return (
                  <option value={modReasonOpt.code} key={modReasonOpt.code}>
                    {modReasonOpt.name}
                  </option>
                );
              }
            )}
          </FormikSelectField>
        </Grid>
        <Grid item xs={12}>
          <FormikTextField
            id="moderationDetails"
            label="Moderation Details"
            fieldProps={formik.getFieldProps('moderationDetails')}
            fieldMeta={formik.getFieldMeta('moderationDetails')}
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          {isLoaderShowing && <LinearProgress />}
          <SharedFormButtons onCancel={onCancel} />
        </Grid>
      </Grid>
    </form>
  );
};
