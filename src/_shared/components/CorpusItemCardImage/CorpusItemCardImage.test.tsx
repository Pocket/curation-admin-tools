import React from 'react';
import { render, screen } from '@testing-library/react';

import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { CorpusItemCardImage } from './CorpusItemCardImage';
import { getTestApprovedItem } from '../../../curated-corpus/helpers/approvedItem';
import { ScheduledSurfaces } from '../../../curated-corpus/helpers/definitions';

describe('The CorpusItemCardImage component', () => {
  let item: ApprovedCorpusItem = getTestApprovedItem();
  const currentScheduledDate = '2024-01-20';

  const toggleScheduleHistoryModal = jest.fn();

  it('should only render topic overlay label', () => {
    render(
      <CorpusItemCardImage
        item={item}
        currentScheduledDate={currentScheduledDate}
        scheduledSurfaceGuid="NEW_TAB_EN_US"
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
      />
    );

    expect(screen.getByText('Health & Fitness')).toBeInTheDocument();

    // assert that these labels are not present
    expect(screen.queryByText(/collection/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/syndicated/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/time sensitive/i)).not.toBeInTheDocument();
  });

  it('should render time sensitive label if item has this prop', () => {
    item = {
      ...item,
      isTimeSensitive: true,
    };

    render(
      <CorpusItemCardImage
        item={item}
        currentScheduledDate={currentScheduledDate}
        scheduledSurfaceGuid="NEW_TAB_EN_US"
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
      />
    );

    expect(screen.getByText(/time sensitive/i)).toBeInTheDocument();
  });

  it('should render collection label if item has this prop', () => {
    item = {
      ...item,
      isCollection: true,
    };

    render(
      <CorpusItemCardImage
        item={item}
        currentScheduledDate={currentScheduledDate}
        scheduledSurfaceGuid="NEW_TAB_EN_US"
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
      />
    );

    expect(screen.getByText(/collection/i)).toBeInTheDocument();
  });

  it('should render syndicated label if item has this prop', () => {
    item = {
      ...item,
      isSyndicated: true,
    };

    render(
      <CorpusItemCardImage
        item={item}
        currentScheduledDate={currentScheduledDate}
        scheduledSurfaceGuid="NEW_TAB_EN_US"
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
      />
    );

    expect(screen.getByText(/syndicated/i)).toBeInTheDocument();
  });

  it('should render last scheduled label if item has this prop', () => {
    item = {
      ...item,
      scheduledSurfaceHistory: [
        {
          createdBy: 'ad|Mozilla-LDAP|aperson',
          externalId: 'bogus-external-id',
          scheduledDate: '2024-01-20',
          scheduledSurfaceGuid: ScheduledSurfaces[0].guid,
        },
        {
          createdBy: 'ad|Mozilla-LDAP|bperson',
          externalId: 'useless-external-id',
          scheduledDate: '2024-01-18',
          scheduledSurfaceGuid: ScheduledSurfaces[1].guid,
        },
      ],
    };

    render(
      <CorpusItemCardImage
        item={item}
        currentScheduledDate={currentScheduledDate}
        scheduledSurfaceGuid="NEW_TAB_EN_US"
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
      />
    );

    expect(screen.getByText(/last scheduled 2 days ago/i)).toBeInTheDocument();
  });
});
