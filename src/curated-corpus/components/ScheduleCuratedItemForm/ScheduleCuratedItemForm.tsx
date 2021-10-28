import React, { useState } from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Grid } from '@material-ui/core';
import { FormikHelpers, FormikValues, useFormik } from 'formik';
import { DateTime } from 'luxon';
import {
  FormikSelectField,
  SharedFormButtons,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { validationSchema } from './ScheduleCuratedItemForm.validation';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

interface ScheduleCuratedItemFormProps {
  /**
   * The UUID of the Curated Item about to be scheduled.
   */
  curatedItemExternalId: string;

  // should be NewTabFeed, but do we have this in the schema? not yet
  newTabList: string[];

  /**
   * What do we do with the submitted data?
   */
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
}

export const ScheduleCuratedItemForm: React.FC<
  ScheduleCuratedItemFormProps & SharedFormButtonsProps
> = (props): JSX.Element => {
  const { curatedItemExternalId, newTabList, onCancel, onSubmit } = props;

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
      newTabFeedExternalId: '',
      curatedItemExternalId: curatedItemExternalId,
      scheduledDate: selectedDate,
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    // TODO: pass the Luxon DateTime object saved in `selectedDate`
    //  instead of the string value from the input here
    onSubmit: (values, formikHelpers) => {
      onSubmit(values, formikHelpers);
    },
  });

  return (
    <>
      <form name="curated-item-search-form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormikSelectField
              id="status"
              label="Choose a New Tab"
              fieldProps={formik.getFieldProps('newTabExternalId')}
              fieldMeta={formik.getFieldMeta('newTabExternalId')}
            >
              <option aria-label="None" value="" />
              {newTabList.map((newTab, index) => {
                return (
                  <option value={newTab} key={index + 1}>
                    New Tab #{index} ({newTab})
                  </option>
                );
              })}
            </FormikSelectField>
          </Grid>
          <Grid item xs={12}>
            <KeyboardDatePicker
              variant="inline"
              inputVariant="outlined"
              format="MMMM d, yyyy"
              margin="none"
              id="scheduled-date"
              label="Choose a date"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              disablePast
              initialFocusedDate={tomorrow}
              maxDate={tomorrow.plus({ months: 2 })}
              disableToolbar
              autoOk
              fullWidth
            />
          </Grid>
        </Grid>
        <SharedFormButtons onCancel={onCancel} />
      </form>
    </>
  );
};
