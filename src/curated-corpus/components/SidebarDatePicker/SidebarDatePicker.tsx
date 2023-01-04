import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

interface SidebarDatePickerProps {
  /**
   * What to do when the user picks a date.
   */
  handleDateChange: (date: any, value?: string | null | undefined) => void;

  /**
   * A date in the Luxon DateTime format to be used with the Material UI Date Picker
   */
  selectedDate: DateTime;
}

/**
 * Little more than an out-of-the-box MUI date picker, this component is used
 * in the sidebar to provide a means of selecting a date for summary scheduling data.
 *
 * @param props
 * @constructor
 */
export const SidebarDatePicker: React.FC<SidebarDatePickerProps> = (
  props
): JSX.Element => {
  const { handleDateChange, selectedDate } = props;

  // state variable to track date picker open state.
  // This is being controlled by the onClick on the TextField component within the DatePicker component below
  const [open, setOpen] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DatePicker
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputFormat="MMMM d, yyyy"
        label="Choose a different date"
        value={selectedDate}
        onChange={handleDateChange}
        disablePast
        openTo="day"
        maxDate={selectedDate.plus({ days: 59 })}
        renderInput={(params: any) => (
          <TextField
            fullWidth
            variant="outlined"
            id="scheduled-date"
            label="Choose a date"
            onClick={() => setOpen(true)}
            {...params}
          />
        )}
      />
    </LocalizationProvider>
  );
};
