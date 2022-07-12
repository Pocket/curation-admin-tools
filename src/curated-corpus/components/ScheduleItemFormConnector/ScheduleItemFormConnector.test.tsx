import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { SnackbarProvider } from 'notistack';
import { ScheduleItemFormConnector } from './ScheduleItemFormConnector';
import LuxonUtils from '@date-io/luxon';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { getScheduledSurfacesForUser } from '../../../api/queries/getScheduledSurfacesForUser';
import { ProspectType } from '../../../api/generatedTypes';

describe('ScheduleItemFormConnector', () => {
  //TODO: move the below variable into a shared file
  const mocks = [
    {
      request: {
        query: getScheduledSurfacesForUser,
      },
      result: {
        data: {
          getScheduledSurfacesForUser: [
            {
              name: 'New Tab (en-US)',
              guid: 'NEW_TAB_EN_US',
              ianaTimezone: 'America/New_York',
              prospectTypes: [
                ProspectType.Global,
                ProspectType.OrganicTimespent,
                ProspectType.SyndicatedNew,
                ProspectType.SyndicatedRerun,
                ProspectType.CountsLogisticApproval,
                ProspectType.HybridLogisticApproval,
                ProspectType.Approved,
                ProspectType.TimespentLogisticApproval,
              ],
            },
            {
              name: 'New Tab (de-DE)',
              guid: 'NEW_TAB_DE_DE',
              ianaTimezone: 'Europe/Berlin',
              prospectTypes: [
                ProspectType.Global,
                ProspectType.OrganicTimespent,
                ProspectType.DomainAllowlist,
              ],
            },
          ],
        },
      },
    },
  ];

  it('loads the form with all scheduled surfaces', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <SnackbarProvider>
          <MuiPickersUtilsProvider utils={LuxonUtils}>
            <ScheduleItemFormConnector
              approvedItemExternalId="dummyId"
              onSubmit={jest.fn()}
            />
          </MuiPickersUtilsProvider>
        </SnackbarProvider>
      </MockedProvider>
    );

    // Wait for the form to load, as it needs to fetch a list of surfaces
    // available for the user
    await screen.findByRole('form');

    // get our two new tab drop down option components
    const enUSSelect = screen.getByTestId('NEW_TAB_EN_US');
    const deDESelect = screen.getByTestId('NEW_TAB_DE_DE');

    // assert they both got rendered
    expect(enUSSelect).toBeInTheDocument();
    expect(deDESelect).toBeInTheDocument();
  });
});
