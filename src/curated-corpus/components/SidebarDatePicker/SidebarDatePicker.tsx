import React from 'react';
import { DateTime } from 'luxon';
import { DatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

interface SidebarDatePickerProps {
  /**
   * What to do when the user picks a date.
   */
  handleDateChange: (
    date: MaterialUiPickersDate,
    value?: string | null | undefined
  ) => void;

  /**
   * A date in the Luxon DateTime format to be used with the Material UI Date Picker
   */
  selectedDate: DateTime;
}

export const SidebarDatePicker: React.FC<SidebarDatePickerProps> = (
  props
): JSX.Element => {
  const { handleDateChange, selectedDate } = props;

  return (
    <DatePicker
      variant="inline"
      inputVariant="outlined"
      format="MMMM d, yyyy"
      margin="none"
      id="scheduled-date"
      label="Choose a different date"
      value={selectedDate}
      onChange={handleDateChange}
      disablePast
      initialFocusedDate={selectedDate}
      maxDate={selectedDate.plus({ days: 59 })}
      disableToolbar
      autoOk
      fullWidth
    />
  );
};
