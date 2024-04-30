import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { DateTime } from 'luxon';
import userEvent from '@testing-library/user-event';

import { ActionScreen } from '../../../../api/generatedTypes';

import { getTestApprovedItem } from '../../../helpers/approvedItem';
import { successMock } from '../../../integration-test-mocks/createScheduledCorpusItem';
import { apolloCache } from '../../../../api/client';
import { ScheduleCorpusItemAction } from './ScheduleCorpusItemAction';
import { mock_AllScheduledSurfaces } from '../../../integration-test-mocks/getScheduledSurfacesForUser';
import { mock_scheduledItemsWithParams } from '../../../integration-test-mocks/getScheduledItems';

describe('The ScheduleCorpusItemAction', () => {
  let mocks: MockedResponse[] = [];

  // This test suite occasionally takes forever to run on a local machine
  jest.setTimeout(10000);

  it('renders the modal and form', async () => {
    // This first mock is needed for the form to load
    mocks = [mock_AllScheduledSurfaces];

    render(
      <MockedProvider mocks={mocks} cache={apolloCache}>
        <SnackbarProvider maxSnack={3}>
          <ScheduleCorpusItemAction
            item={getTestApprovedItem()}
            actionScreen={ActionScreen.Schedule}
            toggleModal={jest.fn()}
            modalOpen={true}
          />
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
    // setting a fixed timezone since this test has a tendency of passing locally but failing
    // on CI due to server and local timezone discrepancies
    const chosenDate = DateTime.local()
      .setZone('Europe/London')
      .plus({ days: 1 });

    const chosenSurfaceGuid = 'NEW_TAB_EN_GB';

    mocks = [
      mock_AllScheduledSurfaces,
      mock_scheduledItemsWithParams(
        chosenDate.toFormat('yyyy-MM-dd'),
        chosenSurfaceGuid
      ),
      successMock(chosenDate.toFormat('yyyy-MM-dd'), chosenSurfaceGuid),
    ];

    render(
      <MockedProvider mocks={mocks} cache={apolloCache}>
        <SnackbarProvider maxSnack={3}>
          <ScheduleCorpusItemAction
            item={getTestApprovedItem()}
            actionScreen={ActionScreen.Schedule}
            toggleModal={jest.fn()}
            modalOpen={true}
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
    userEvent.selectOptions(surfaceSelect, chosenSurfaceGuid);

    const datePicker = screen.getByRole('button', {
      name: /choose date/i,
    }) as HTMLInputElement;

    // Click on the date field to bring up the calendar
    userEvent.click(datePicker);

    // Find the chosen date on the monthly calendar (in MUI 5, it's a grid cell)
    const monthYear = screen.getAllByRole('grid', {
      name: chosenDate.toFormat('MMMM yyyy'),
    });
    expect(monthYear).toHaveLength(1);

    const day = screen.getAllByRole('gridcell', {
      name: chosenDate.toFormat('d'),
    })[0];

    // Choose it
    userEvent.click(day);

    userEvent.click(screen.getByText('Save'));

    // Testing for the success toast notification. Omitting the date from
    // the text tested for as it has caused so many false alarms on CI.
    expect(
      await screen.findByText(/Item scheduled successfully/i)
    ).toBeInTheDocument();
  });

  // See notes in RejectCorpusItemAction.test.tsx - add a fail test once it's
  // possible to do so
  it.todo('fails if approved item has scheduled entries');
});
