import React from 'react';
import { render, screen } from '@testing-library/react';
import { ApprovedCorpusItemScheduledSurfaceHistory } from '../../../api/generatedTypes';
import { ScheduleHistoryEntries } from './ScheduleHistoryEntries';
import { ScheduledSurfaces } from '../../helpers/definitions';
import {
  getCuratorNameFromLdap,
  getScheduledSurfaceName,
} from '../../helpers/helperFunctions';

describe('The ScheduleHistoryEntries component', () => {
  let approvedItemScheduleSurfaceHistory: ApprovedCorpusItemScheduledSurfaceHistory[];

  beforeAll(() => {
    approvedItemScheduleSurfaceHistory = [
      {
        createdBy: 'ad|Mozilla-LDAP|aperson',
        externalId: 'bogus-external-id',
        scheduledDate: '2022-08-01',
        scheduledSurfaceGuid: ScheduledSurfaces[0].guid,
      },
      {
        createdBy: 'ad|Mozilla-LDAP|bperson',
        externalId: 'useless-external-id',
        scheduledDate: '2022-08-02',
        scheduledSurfaceGuid: ScheduledSurfaces[1].guid,
      },
    ];
  });

  it('should render two recent scheduled run items', async () => {
    render(
      <ScheduleHistoryEntries data={approvedItemScheduleSurfaceHistory} />,
    );

    // fetch details for the first scheduled run item below
    const firstScheduledRunCurator = screen.getByText(
      `${getCuratorNameFromLdap(
        approvedItemScheduleSurfaceHistory[0].createdBy,
      )}`,
    );
    const firstScheduledRunDate = screen.getByText('August 1, 2022');

    const firstScheduledRunSurface = screen.getByText(
      `${getScheduledSurfaceName(
        approvedItemScheduleSurfaceHistory[0].scheduledSurfaceGuid,
      )}`,
    );

    // assert that the first scheduled run item was rendered
    expect(firstScheduledRunCurator).toBeInTheDocument();
    expect(firstScheduledRunDate).toBeInTheDocument();
    expect(firstScheduledRunSurface).toBeInTheDocument();

    // fetch details for the second scheduled run item below
    const secondScheduledRunCurator = screen.getByText(
      `${getCuratorNameFromLdap(
        approvedItemScheduleSurfaceHistory[1].createdBy,
      )}`,
    );
    const secondScheduledRunDate = screen.getByText('August 2, 2022');

    const secondScheduledRunSurface = screen.getByText(
      `${getScheduledSurfaceName(
        approvedItemScheduleSurfaceHistory[1].scheduledSurfaceGuid,
      )}`,
    );

    // assert that the second scheduled run item was rendered
    expect(secondScheduledRunCurator).toBeInTheDocument();
    expect(secondScheduledRunDate).toBeInTheDocument();
    expect(secondScheduledRunSurface).toBeInTheDocument();
  });
});
