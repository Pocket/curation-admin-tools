import React from 'react';
import { Grid, LinearProgress } from '@mui/material';
import { FormikHelpers, FormikValues, useFormik } from 'formik';
import {
  FormikTextField,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { ShareableListComplete } from '../../../api/generatedTypes';
import { validationSchema } from './ShareableListRestorationForm.validation';

interface ShareableListRestorationFormProps {
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
export const ShareableListRestorationForm: React.FC<
  ShareableListRestorationFormProps & SharedFormButtonsProps
> = (props) => {
  // de-structure props
  const { onCancel, onSubmit, isLoaderShowing, shareableList } = props;

  // set up formik object for this form
  const formik = useFormik({
    initialValues: {
      restorationReason: shareableList.restorationReason ?? '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit,
  });

  return (
    <form name="restore-shareable-list-form" onSubmit={formik.handleSubmit}>
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
          <FormikTextField
            id="restorationReason"
            label="Restoration Reason"
            fieldProps={formik.getFieldProps('restorationReason')}
            fieldMeta={formik.getFieldMeta('restorationReason')}
            autoFocus
            multiline
            minRows={4}
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
