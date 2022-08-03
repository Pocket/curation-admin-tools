import { render, screen, waitFor } from '@testing-library/react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import React from 'react';
import { SidebarDatePicker } from './SidebarDatePicker';
import { DateTime } from 'luxon';

describe('SidebarDatePicker', () => {
  // This is really all we need to test for as it's a MUI component.
  // Integration tests are supposed to go in to SidebarWrapper-related tests.
  it('should show the date picker', async () => {
    render(
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <SidebarDatePicker
          selectedDate={DateTime.fromFormat('2050-05-05', 'yyyy-MM-dd')}
          handleDateChange={jest.fn()}
        ></SidebarDatePicker>
      </MuiPickersUtilsProvider>
    );

    await waitFor(() => {
      const datePicker = screen.getByLabelText(
        /choose a different date/i
      ) as HTMLInputElement;

      expect(datePicker).toBeInTheDocument();
      expect(datePicker.value).toMatch(/may 5, 2050/i);
    });
  });
});
