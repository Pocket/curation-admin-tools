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
      guid: 'NEW_TAB_EN_US',
      utcOffset: -4000,
      prospectTypes: [
        ProspectType.Global,
        ProspectType.OrganicTimespent,
        ProspectType.Syndicated,
      ],
    },
    {
      name: 'de-DE',
      guid: 'NEW_TAB_DE_DE',
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

  it('does not pre-select a scheduled surface if none was passed in and the user has access to many', () => {
    render(
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <ScheduleItemForm
          data-testId="surface-selector"
          handleDateChange={jest.fn()}
          lookupCopy=""
          selectedDate={DateTime.local()}
          onSubmit={handleSubmit}
          scheduledSurfaces={scheduledSurfaces}
          approvedItemExternalId={'123abc'}
        />
      </MuiPickersUtilsProvider>
    );

    const select = screen.getByLabelText(
      'Choose a Scheduled Surface'
    ) as HTMLSelectElement;

    // there should be an empty option and a single scheduled surface option
    expect(select.options.length).toEqual(scheduledSurfaces.length + 1);

    // the empty option should be selected
    expect(select.options[0].selected).toBeTruthy();
  });

  it('pre-selects the passed in scheduled surface', () => {
    render(
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <ScheduleItemForm
          data-testId="surface-selector"
          handleDateChange={jest.fn()}
          lookupCopy=""
          selectedDate={DateTime.local()}
          onSubmit={handleSubmit}
          scheduledSurfaces={scheduledSurfaces}
          scheduledSurfaceGuid="NEW_TAB_EN_US"
          approvedItemExternalId={'123abc'}
        />
      </MuiPickersUtilsProvider>
    );

    const select = screen.getByLabelText(
      'Choose a Scheduled Surface'
    ) as HTMLSelectElement;

    // there should be an empty option and a single scheduled surface option
    expect(select.options.length).toEqual(scheduledSurfaces.length + 1);

    // the `NEW_TAB_EN_US` option should be selected
    expect(select.options[1].selected).toBeTruthy();
    expect(select.options[1].value).toEqual('NEW_TAB_EN_US');
  });

  it('pre-selects the only available scheduled surface if none was specified and the user only has access to a single one', () => {
    render(
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <ScheduleItemForm
          data-testId="surface-selector"
          handleDateChange={jest.fn()}
          lookupCopy=""
          selectedDate={DateTime.local()}
          onSubmit={handleSubmit}
          scheduledSurfaces={[scheduledSurfaces[0]]}
          approvedItemExternalId={'123abc'}
        />
      </MuiPickersUtilsProvider>
    );

    const select = screen.getByLabelText(
      'Choose a Scheduled Surface'
    ) as HTMLSelectElement;

    // there should be an empty option and a single scheduled surface option
    expect(select.options.length).toEqual(2);

    // the scheduled surface should be selected
    expect(select.options[1].selected).toBeTruthy();
  });
});
