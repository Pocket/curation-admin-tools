import React from 'react';
import { Grid, LinearProgress } from '@mui/material';
import { FormikHelpers, FormikValues, useFormik } from 'formik';
import {
  FormikSelectField,
  FormikTextField,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { ShareableList } from '../../../api/generatedTypes';
import {
  DropdownOption,
  shareableListModerationStatusOptions,
} from '../../helpers/definitions';
import { validationSchema } from './ShareableListModerationForm.validation';

interface ShareableListModerationFormProps {
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;

  // show/hide the loading bar on submissions
  isLoaderShowing: boolean;

  /**
   * An object with everything shareableList-related in it.
   */
  shareableList: ShareableList;
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
      // shareableListTitle: shareableList?.title ?? '',
      moderationStatus: shareableList.moderationStatus ?? '',
      moderationReason: shareableList.moderationReason ?? '',
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
            id="shareableListModerationStatus"
            label="Moderation Status"
            fieldProps={formik.getFieldProps('moderationStatus')}
            fieldMeta={formik.getFieldMeta('moderationStatus')}
          >
            <option aria-label="None" value="" />
            {shareableListModerationStatusOptions.map(
              (modStatus: DropdownOption) => {
                return (
                  <option value={modStatus.code} key={modStatus.code}>
                    {modStatus.name}
                  </option>
                );
              }
            )}
          </FormikSelectField>
        </Grid>
        <Grid item xs={12}>
          <FormikTextField
            id="shareableListModerationReason"
            label="Moderation Reason"
            fieldProps={formik.getFieldProps('moderationReason')}
            fieldMeta={formik.getFieldMeta('moderationReason')}
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
