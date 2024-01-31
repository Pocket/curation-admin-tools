import React from 'react';
import { SnackbarProvider } from 'notistack';
import { DateTime } from 'luxon';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { ScheduleItemFormConnector } from './ScheduleItemFormConnector';
import {
  mock_AllScheduledSurfaces,
  mock_OneScheduledSurface,
  mock_TwoScheduledSurfaces,
} from '../../integration-test-mocks/getScheduledSurfacesForUser';
import { mock_ScheduledItemCountsZero } from '../../integration-test-mocks/getScheduledItemCounts';

describe('ScheduleItemFormConnector', () => {
  let mocks = [];

  it('loads the form with all scheduled surfaces', async () => {
    mocks = [mock_AllScheduledSurfaces];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <ScheduleItemFormConnector
            approvedItemExternalId="dummyId"
            onSubmit={jest.fn()}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    // Wait for the form to load, as it needs to fetch a list of surfaces
    // available for the user
    await screen.findByRole('form');

    // Get the dropdown with available scheduled surfaces
    const surfaceSelect = screen.getByLabelText(
      /choose a scheduled surface/i
    ) as HTMLSelectElement;

    const scheduledSurfaceValues = [
      'NEW_TAB_EN_US',
      'NEW_TAB_EN_GB',
      'NEW_TAB_DE_DE',
      'NEW_TAB_EN_INTL',
      'POCKET_HITS_EN_US',
      'POCKET_HITS_DE_DE',
      'SANDBOX',
    ];

    // Round up all the select elements (all the surfaces + 'Choose a scheduled surface' option
    expect(surfaceSelect.length).toEqual(scheduledSurfaceValues.length + 1);

    // Loop through to make sure they're all there
    scheduledSurfaceValues.forEach((surfaceValue: string) => {
      userEvent.selectOptions(surfaceSelect, surfaceValue);
      expect(surfaceSelect).toHaveValue(surfaceValue);
    });
  });

  it('loads the form with two scheduled surfaces', async () => {
    mocks = [mock_TwoScheduledSurfaces];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <ScheduleItemFormConnector
            approvedItemExternalId="dummyId"
            onSubmit={jest.fn()}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    // Wait for the form to load, as it needs to fetch a list of surfaces
    // available for the user
    await screen.findByRole('form');

    // Get the dropdown with available scheduled surfaces
    const surfaceSelect = screen.getByLabelText(
      /choose a scheduled surface/i
    ) as HTMLSelectElement;

    const scheduledSurfaceValues = ['NEW_TAB_EN_US', 'NEW_TAB_DE_DE'];

    // Round up all the select elements (the two choices + 'Choose a scheduled surface' option
    expect(surfaceSelect.length).toEqual(scheduledSurfaceValues.length + 1);

    // Loop through to make sure the two expected surfaces are there
    scheduledSurfaceValues.forEach((surfaceValue: string) => {
      userEvent.selectOptions(surfaceSelect, surfaceValue);
      expect(surfaceSelect).toHaveValue(surfaceValue);
    });
  });

  it('loads the form with a single available scheduled surface', async () => {
    mocks = [mock_OneScheduledSurface];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <ScheduleItemFormConnector
            approvedItemExternalId="dummyId"
            onSubmit={jest.fn()}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    // Wait for the form to load, as it needs to fetch a list of surfaces
    // available for the user
    await screen.findByRole('form');

    // Get the dropdown with available scheduled surfaces
    const surfaceSelect = screen.getByLabelText(
      /choose a scheduled surface/i
    ) as HTMLSelectElement;

    const scheduledSurfaceValues = ['POCKET_HITS_EN_US'];

    // Round up all the select elements (the one choice + 'Choose a scheduled surface' option
    expect(surfaceSelect.length).toEqual(scheduledSurfaceValues.length + 1);

    // Make sure the expected surface is there
    userEvent.selectOptions(surfaceSelect, scheduledSurfaceValues[0]);
    expect(surfaceSelect).toHaveValue(scheduledSurfaceValues[0]);
  });

  it('loads the count of scheduled items for a given date', async () => {
    mocks = [mock_OneScheduledSurface, mock_ScheduledItemCountsZero];

    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <ScheduleItemFormConnector
            approvedItemExternalId="dummyId"
            onSubmit={jest.fn()}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    // Wait for the form to load, as it needs to fetch a list of surfaces
    // available for the user
    await screen.findByRole('form');

    // Get the dropdown with available scheduled surfaces
    const surfaceSelect = screen.getByLabelText(
      /choose a scheduled surface/i
    ) as HTMLSelectElement;

    // Select a scheduled surface
    userEvent.selectOptions(surfaceSelect, 'POCKET_HITS_EN_US');

    const datePicker = screen.getByRole('button', {
      name: /choose date/i,
    }) as HTMLInputElement;

    // Click on the date field to bring up the calendar
    userEvent.click(datePicker);

    // Find today's date on the monthly calendar (in MUI 5, it's a grid cell)
    /*
     * !-- Flakey test --!
     * Jan 31, 2024 -- When running the test case on the last day of a month,
     * the UI renders the calendar component with the a day pushed ahead. That makes it render February.
     * Since February does not have 31 days, this test fails. We also have to adjust for the timezone because
     * this also happens sometimes due to a mismatch of local (developer's machine) timezone and the CI server time zone.
     */
    const today = DateTime.local()
      .plus({ days: 1 })
      .setZone('America/New_York');
    const todaysDate = screen.getAllByRole('gridcell', {
      name: today.toFormat('d'),
    })[0];

    // Choose it
    userEvent.click(todaysDate);

    // TODO:
    //  - wait for the API call to go through
    //  - Assert that the copy with the number of items already scheduled
    //  appears on the screen
  });

  // TODO: More tests:
  // - if query succeeds but there are no scheduled items for that date yet,
  // check for presence of "Nothing has been scheduled for this date yet." on the screen

  // if query succeeds and there's X number of items scheduled, look for
  // "Already scheduled: X story/stories (Y syndicated)" copy
});
