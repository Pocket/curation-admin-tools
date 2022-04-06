import React, { useEffect } from 'react';
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
import { ScheduledSurface } from '../../../api/generatedTypes';
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
   * The list of Scheduled Surfaces the logged-in user has access to.
   */
  scheduledSurfaces: ScheduledSurface[];

  /**
   * If a default value for the Scheduled Surface dropdown needs to be set,
   * here is the place to specify it.
   */
  scheduledSurfaceGuid?: string;

  /**
   * Whether to lock the scheduled surface dropdown to just the value sent through
   * in the `scheduledSurfaceGuid` variable.
   */
  disableScheduledSurface?: boolean;

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
    scheduledSurfaces,
    scheduledSurfaceGuid,
    disableScheduledSurface = false,
    selectedDate,
    onCancel,
    onSubmit,
  } = props;

  const tomorrow = DateTime.local().plus({ days: 1 });

  // Run the lookup query for scheduled items on loading the component,
  // so that users can see straight away how many stories have already
  // been scheduled for the default date (tomorrow).
  useEffect(() => {
    handleDateChange(tomorrow);
  }, []);

  // if a scheduledSurfaceGuid was not supplied (meaning this is a manually
  // added item), check to see if the user only has access to a single
  // scheduled surface. if so, auto-select that one. if they have access to
  // multiple, the default value should be an empty string (as react does *not*
  // like `null` or `undefined` in this case).
  const selectedScheduledSurfaceGuid =
    scheduledSurfaceGuid ||
    (scheduledSurfaces.length === 1 ? scheduledSurfaces[0].guid : '');

  const formik = useFormik({
    initialValues: {
      scheduledSurfaceGuid: selectedScheduledSurfaceGuid,
      approvedItemExternalId,
      scheduledDate: selectedDate,
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: getValidationSchema(scheduledSurfaces),
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
              id="scheduledSurfaceGuid"
              label="Choose a Scheduled Surface"
              disabled={
                (scheduledSurfaceGuid as unknown as boolean) &&
                disableScheduledSurface
              }
              fieldProps={formik.getFieldProps('scheduledSurfaceGuid')}
              fieldMeta={formik.getFieldMeta('scheduledSurfaceGuid')}
            >
              <option aria-label="None" value="" />
              {scheduledSurfaces.map((scheduledSurface: ScheduledSurface) => {
                return (
                  <option
                    value={scheduledSurface.guid}
                    key={scheduledSurface.guid}
                  >
                    {scheduledSurface.name}
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
