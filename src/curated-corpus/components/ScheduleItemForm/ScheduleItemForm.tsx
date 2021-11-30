import React, { useState } from 'react';
import { Box, Grid, TextField } from '@material-ui/core';
import { FormikHelpers, FormikValues, useFormik } from 'formik';
import { DateTime } from 'luxon';
import { DatePicker } from '@material-ui/pickers';
import {
  FormikSelectField,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { validationSchema } from './ScheduleItemForm.validation';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { NewTab } from '../../helpers/definitions';

interface ScheduleItemFormProps {
  /**
   * The UUID of the Approved Curated Item about to be scheduled.
   */
  approvedItemExternalId: string;

  /**
   * The list of New Tabs the logged-in user has access to.
   */
  newTabList: NewTab[];

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
  const { approvedItemExternalId, newTabList, onCancel, onSubmit } = props;

  // Set the default scheduled date to tomorrow.
  // Do we need to worry about timezones here? .local() returns the date
  // in the user locale, not the UTC date.
  const tomorrow = DateTime.local().plus({ days: 1 });

  // Save the date in a state var as the submitted form will contain
  // a formatted string instead of a luxon object. Would like to work with the luxon
  // object instead of parsing the date from string.
  const [selectedDate, setSelectedDate] = useState<DateTime | null>(tomorrow);

  const handleDateChange = (
    date: MaterialUiPickersDate,
    value?: string | null | undefined
  ) => {
    setSelectedDate(date);
  };

  const formik = useFormik({
    initialValues: {
      newTabGuid: '',
      approvedItemExternalId,
      scheduledDate: selectedDate,
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
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
              fieldProps={formik.getFieldProps('newTabGuid')}
              fieldMeta={formik.getFieldMeta('newTabGuid')}
            >
              <option aria-label="None" value="" />
              {newTabList.map((newTab: NewTab) => {
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
        </Grid>
        <SharedFormButtons onCancel={onCancel} />
        <Box display="none">
          <TextField
            type="hidden"
            id="approvedItemExternalId"
            label="approvedItemExternalId"
            {...formik.getFieldProps('approvedItemExternalId')}
          />
        </Box>
      </form>
    </>
  );
};
