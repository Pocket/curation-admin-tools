import React from 'react';
import { DateTime } from 'luxon';
import { render, screen } from '@testing-library/react';
import { ScheduleItemForm } from './ScheduleItemForm';
import { ProspectType, ScheduledSurface } from '../../../api/generatedTypes';

describe('The ScheduleItemForm component', () => {
  const handleSubmit = jest.fn();

  // This is the shape of the data the form receives via the `getScheduledSurfacesForUser` query
  const scheduledSurfaces: ScheduledSurface[] = [
    {
      name: 'en-US',
      guid: 'NEW_TAB_EN_US',
      ianaTimezone: 'America/New_York',
      prospectTypes: [
        ProspectType.Global,
        ProspectType.OrganicTimespent,
        ProspectType.SyndicatedNew,
      ],
    },
    {
      name: 'de-DE',
      guid: 'NEW_TAB_DE_DE',
      ianaTimezone: 'Europe/Berlin',
      prospectTypes: [ProspectType.Global],
    },
  ];

  it('renders successfully', () => {
    render(
      <ScheduleItemForm
        handleDateChange={jest.fn()}
        lookupCopy=""
        selectedDate={DateTime.local()}
        onSubmit={handleSubmit}
        scheduledSurfaces={scheduledSurfaces}
        approvedItemExternalId={'123abc'}
      />
    );

    // there is at least a form and nothing falls over
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('has three buttons', () => {
    render(
      <ScheduleItemForm
        handleDateChange={jest.fn()}
        lookupCopy=""
        selectedDate={DateTime.local()}
        onSubmit={handleSubmit}
        scheduledSurfaces={scheduledSurfaces}
        approvedItemExternalId={'123abc'}
      />
    );

    const buttons = screen.getAllByRole('button');
    // "Save" and "Cancel" buttons, plus the "DatePicker"
    // button in the far right of the date picker field
    expect(buttons).toHaveLength(3);
  });

  it('does not pre-select a scheduled surface if none was passed in and the user has access to many', () => {
    render(
      <ScheduleItemForm
        data-testId="surface-selector"
        handleDateChange={jest.fn()}
        lookupCopy=""
        selectedDate={DateTime.local()}
        onSubmit={handleSubmit}
        scheduledSurfaces={scheduledSurfaces}
        approvedItemExternalId={'123abc'}
      />
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
      <ScheduleItemForm
        data-testId="surface-selector"
        handleDateChange={jest.fn()}
        lookupCopy=""
        selectedDate={DateTime.local()}
        onSubmit={handleSubmit}
        scheduledSurfaces={[scheduledSurfaces[0]]}
        approvedItemExternalId={'123abc'}
      />
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
