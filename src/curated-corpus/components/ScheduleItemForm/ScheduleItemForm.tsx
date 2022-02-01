import React from 'react';
import { Box, Grid, LinearProgress, TextField } from '@material-ui/core';
import { FormikHelpers, FormikValues, useFormik } from 'formik';
import { DatePicker } from '@material-ui/pickers';
import {
  FormikSelectField,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { getValidationSchema } from './ScheduleItemForm.validation';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { NewTab } from '../../../api/generatedTypes';
import { DateTime } from 'luxon';

interface ScheduleItemFormProps {
  /**
   * The UUID of the Approved Curated Item about to be scheduled.
   */
  approvedItemExternalId: string;

  /**
   * What to do when the user picks a date.
   */
  handleDateChange: (
    date: MaterialUiPickersDate,
    value?: string | null | undefined
  ) => void;

  /**
   * The copy/JSX to show underneath the form when the user picks a date
   * and a call to the API is triggered to look up whether any other
   * items have been scheduled for this date.
   */
  lookupCopy: JSX.Element | string;

  /**
   * The list of New Tabs the logged-in user has access to.
   */
  newTabs: NewTab[];

  /**
   * If a default value for the New Tab dropdown needs to be set,
   * here is the place to specify it.
   */
  newTabGuid?: string;

  /**
   *
   */
  disableNewTab?: boolean;

  /**
   *
   * Note that null is an option here to keep MUI types happy, nothing else.
   */
  selectedDate: DateTime | null;

  /**
   * What do we do with the submitted data?
   */
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
}

export const ScheduleItemForm: React.FC<
  ScheduleItemFormProps & SharedFormButtonsProps
> = (props): JSX.Element => {
  const {
    approvedItemExternalId,
    handleDateChange,
    lookupCopy,
    newTabs,
    newTabGuid,
    disableNewTab = false,
    selectedDate,
    onCancel,
    onSubmit,
  } = props;

  const tomorrow = DateTime.local().plus({ days: 1 });

  const formik = useFormik({
    initialValues: {
      newTabGuid,
      approvedItemExternalId,
      scheduledDate: selectedDate,
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: getValidationSchema(newTabs),
    onSubmit: (values, formikHelpers) => {
      // Make sure the date is the one selected by the user
      // (Without this, Formik passes on the initial date = tomorrow.)
      values.scheduledDate = selectedDate;

      onSubmit(values, formikHelpers);
    },
  });

  return (
    <>
      <form name="schedule-item-form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormikSelectField
              id="newTabGuid"
              label="Choose a New Tab"
              disabled={disableNewTab}
              fieldProps={formik.getFieldProps('newTabGuid')}
              fieldMeta={formik.getFieldMeta('newTabGuid')}
            >
              <option aria-label="None" value="" />
              {newTabs.map((newTab: NewTab) => {
                return (
                  <option value={newTab.guid} key={newTab.guid}>
                    {newTab.name}
                  </option>
                );
              })}
            </FormikSelectField>
          </Grid>
          <Grid item xs={12}>
            <DatePicker
              variant="inline"
              inputVariant="outlined"
              format="MMMM d, yyyy"
              margin="none"
              id="scheduled-date"
              label="Choose a date"
              value={selectedDate}
              onChange={handleDateChange}
              disablePast
              initialFocusedDate={tomorrow}
              maxDate={tomorrow.plus({ days: 59 })}
              disableToolbar
              autoOk
              fullWidth
            />
          </Grid>

          {formik.isSubmitting && (
            <Grid item xs={12}>
              <Box mb={3}>
                <LinearProgress />
              </Box>
            </Grid>
          )}
        </Grid>
        <Box display="none">
          <TextField
            type="hidden"
            id="approvedItemExternalId"
            label="approvedItemExternalId"
            {...formik.getFieldProps('approvedItemExternalId')}
          />
        </Box>

        <SharedFormButtons onCancel={onCancel} />
      </form>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" mt={2} mb={1}>
            <h3>{lookupCopy}</h3>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
