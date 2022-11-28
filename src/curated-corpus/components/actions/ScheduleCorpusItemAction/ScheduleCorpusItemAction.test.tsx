import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import userEvent from '@testing-library/user-event';
import LuxonUtils from '@date-io/luxon';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { getTestApprovedItem } from '../../../helpers/approvedItem';
import { successMock } from '../../../integration-test-mocks/createScheduledCorpusItem';
import { apolloCache } from '../../../../api/client';
import { ScheduleCorpusItemAction } from './ScheduleCorpusItemAction';
import { mock_AllScheduledSurfaces } from '../../../integration-test-mocks/getScheduledSurfacesForUser';
import { DateTime } from 'luxon';

describe('The ScheduleCorpusItemAction', () => {
  let mocks: MockedResponse[] = [];

  it('renders the modal and form', async () => {
    // This first mock is needed for the form to load
    mocks = [mock_AllScheduledSurfaces];

    render(
      <MockedProvider mocks={mocks} cache={apolloCache}>
        <SnackbarProvider maxSnack={3}>
          <MuiPickersUtilsProvider utils={LuxonUtils}>
            <ScheduleCorpusItemAction
              item={getTestApprovedItem()}
              toggleModal={jest.fn()}
              modalOpen={true}
            />
          </MuiPickersUtilsProvider>
        </SnackbarProvider>
      </MockedProvider>
    );

    // Do we have the modal heading
    expect(screen.getByText(/schedule this item/i)).toBeInTheDocument();

    // Wait for the form to load (as it runs a lookup query),
    // then test whether we can see it
    const form = await screen.findByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('completes the action successfully', async () => {
    // When running the test case on the last day of a month,
    // MUI date picker also grabs a few previous dates which are marked
    // as hidden and disabled.
    // The current date is not disabled, but it
    // is marked as hidden, hence, MUI complains that it doesn't have a
    // pointer event set on the hidden date.
    // The solution is to add an extra day to ensure that MUI does not fetch
    // the days from a previous month when running the test case on the
    // last day of a month.
    const today = DateTime.local().plus({ days: 1 });

    mocks = [
      mock_AllScheduledSurfaces,
      successMock(today.toFormat('yyyy-MM-dd')),
    ];

    render(
      <MockedProvider mocks={mocks} cache={apolloCache}>
        <SnackbarProvider maxSnack={3}>
          <MuiPickersUtilsProvider utils={LuxonUtils}>
            <ScheduleCorpusItemAction
              item={getTestApprovedItem()}
              toggleModal={jest.fn()}
              modalOpen={true}
            />
          </MuiPickersUtilsProvider>
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
    userEvent.selectOptions(surfaceSelect, 'NEW_TAB_EN_US');

    const datePicker = screen.getByRole('textbox', {
      name: 'Choose a date',
    }) as HTMLInputElement;

    // Click on the date field to bring up the calendar
    userEvent.click(datePicker);

    // Find today's date on the monthly calendar (it's actually a button)
    const todaysDateButton = screen.getAllByRole('button', {
      name: today.toFormat('d'),
    })[0];

    // Choose it
    userEvent.click(todaysDateButton);

    userEvent.click(screen.getByText('Save'));

    // Testing for the success toast notification in two parts
    // as it may be broken up in the markup
    expect(
      await screen.findByText(
        `Item scheduled successfully for ${today
          .setLocale('en')
          .toLocaleString(DateTime.DATE_FULL)}.`
      )
    ).toBeInTheDocument();
  });

  // See notes in RejectCorpusItemAction.test.tsx - add a fail test once it's
  // possible to do so
  it.todo('fails if approved item has scheduled entries');
});
