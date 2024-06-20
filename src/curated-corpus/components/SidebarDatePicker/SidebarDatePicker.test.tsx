import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { SidebarDatePicker } from './SidebarDatePicker';
import { DateTime } from 'luxon';

describe('SidebarDatePicker', () => {
  // This is really all we need to test for as it's a MUI component.
  // Integration tests are supposed to go in to SidebarWrapper-related tests.
  it('should show the date picker', async () => {
    render(
      <SidebarDatePicker
        selectedDate={DateTime.fromFormat('2050-05-05', 'yyyy-MM-dd')}
        handleDateChange={jest.fn()}
      ></SidebarDatePicker>,
    );

    await waitFor(() => {
      const datePicker = screen.getByLabelText(
        /choose a different date/i,
      ) as HTMLInputElement;

      expect(datePicker).toBeInTheDocument();
      expect(datePicker.value).toMatch(/may 5, 2050/i);
    });
  });
});
