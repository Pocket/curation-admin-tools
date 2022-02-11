import React from 'react';
import LuxonUtils from '@date-io/luxon';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { render, screen } from '@testing-library/react';
import { ScheduleItemForm } from './ScheduleItemForm';
import { ProspectType, ScheduledSurface } from '../../../api/generatedTypes';
import { DateTime } from 'luxon';

describe('The ScheduleItemForm component', () => {
  const handleSubmit = jest.fn();

  // This is the shape of the data the form receives via the `getScheduledSurfacesForUser` query
  const scheduledSurfaces: ScheduledSurface[] = [
    {
      name: 'en-US',
      guid: 'EN_US',
      utcOffset: -4000,
      prospectTypes: [
        ProspectType.Global,
        ProspectType.OrganicTimespent,
        ProspectType.Syndicated,
      ],
    },
    {
      name: 'de-DE',
      guid: 'DE_DE',
      utcOffset: 1000,
      prospectTypes: [ProspectType.Global],
    },
  ];

  it('renders successfully', () => {
    render(
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <ScheduleItemForm
          handleDateChange={jest.fn()}
          lookupCopy=""
          selectedDate={DateTime.local()}
          onSubmit={handleSubmit}
          scheduledSurfaces={scheduledSurfaces}
          approvedItemExternalId={'123abc'}
        />
      </MuiPickersUtilsProvider>
    );

    // there is at least a form and nothing falls over
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('has two buttons', () => {
    render(
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <ScheduleItemForm
          handleDateChange={jest.fn()}
          lookupCopy=""
          selectedDate={DateTime.local()}
          onSubmit={handleSubmit}
          scheduledSurfaces={scheduledSurfaces}
          approvedItemExternalId={'123abc'}
        />
      </MuiPickersUtilsProvider>
    );

    const buttons = screen.getAllByRole('button');
    // "Save" and "Cancel" buttons.
    expect(buttons).toHaveLength(2);
  });
});
