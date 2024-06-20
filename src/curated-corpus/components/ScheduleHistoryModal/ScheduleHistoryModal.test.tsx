import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { ScheduleHistoryModal } from './ScheduleHistoryModal';
import { getTestApprovedItem } from '../../helpers/approvedItem';
import { ScheduledSurfaces } from '../../helpers/definitions';

import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme';

describe('The ScheduleHistoryModal component', () => {
  let item: ApprovedCorpusItem = getTestApprovedItem();

  const toggleModal = jest.fn();

  it('should render ScheduleHistoryModal component', () => {
    item = {
      ...item,
      scheduledSurfaceHistory: [
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
      ],
    };

    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <ScheduleHistoryModal
            item={item}
            isOpen={true}
            toggleModal={toggleModal}
          />
        </ThemeProvider>
      </MemoryRouter>,
    );

    // assert that title has rendered
    expect(screen.getByText(`${item.title}`)).toBeInTheDocument();

    // assert that publisher has rendered
    expect(screen.getByText(`${item.publisher}`)).toBeInTheDocument();

    // assert that list heading has rendered
    expect(screen.getByText(/recently scheduled/i)).toBeInTheDocument();

    // assert that the first scheduled history entry details are rendered
    expect(screen.getByText(/aperson/i)).toBeInTheDocument();
    expect(screen.getByText(/August 1, 2022/i)).toBeInTheDocument();
    expect(screen.getByText('New Tab (en-US)')).toBeInTheDocument();

    // fetch and assert that the second scheduled history entry details are rendered successfully
    expect(screen.getByText(/bperson/i)).toBeInTheDocument();
    expect(screen.getByText(/August 2, 2022/i)).toBeInTheDocument();
    expect(screen.getByText('New Tab (de-DE)')).toBeInTheDocument();
  });
});
