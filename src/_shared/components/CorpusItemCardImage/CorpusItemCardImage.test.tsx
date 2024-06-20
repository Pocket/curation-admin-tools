import React from 'react';
import { render, screen } from '@testing-library/react';

import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { CorpusItemCardImage } from './CorpusItemCardImage';
import { getTestApprovedItem } from '../../../curated-corpus/helpers/approvedItem';
import { ScheduledSurfaces } from '../../../curated-corpus/helpers/definitions';
import { curationPalette } from '../../../theme';

describe('The CorpusItemCardImage component', () => {
  let item: ApprovedCorpusItem = getTestApprovedItem();
  const currentScheduledDate = '2024-01-20';

  const toggleScheduleHistoryModal = jest.fn();

  it('should only render topic overlay label', () => {
    render(
      <CorpusItemCardImage
        item={item}
        isMlScheduled={false}
        currentScheduledDate={currentScheduledDate}
        scheduledSurfaceGuid="NEW_TAB_EN_US"
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
      />,
    );

    expect(screen.getByText('Health & Fitness')).toBeInTheDocument();

    // assert that these labels are not present
    expect(screen.queryByText(/collection/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/syndicated/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/time sensitive/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/NEW DOMAIN/i)).not.toBeInTheDocument();
  });

  it('should render time sensitive label if item has this prop', () => {
    item = {
      ...item,
      isTimeSensitive: true,
    };

    render(
      <CorpusItemCardImage
        isMlScheduled={false}
        item={item}
        currentScheduledDate={currentScheduledDate}
        scheduledSurfaceGuid="NEW_TAB_EN_US"
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
      />,
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
        isMlScheduled={false}
        currentScheduledDate={currentScheduledDate}
        scheduledSurfaceGuid="NEW_TAB_EN_US"
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
      />,
    );

    expect(screen.getByText(/collection/i)).toBeInTheDocument();
  });

  it('should render syndicated label if item has this prop', () => {
    const syndicatedItem = { ...item, isSyndicated: true };

    render(
      <CorpusItemCardImage
        item={syndicatedItem}
        isMlScheduled={false}
        currentScheduledDate={currentScheduledDate}
        scheduledSurfaceGuid="NEW_TAB_EN_US"
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
      />,
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
        isMlScheduled={false}
        currentScheduledDate={currentScheduledDate}
        scheduledSurfaceGuid="NEW_TAB_EN_US"
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
      />,
    );

    expect(screen.getByText(/last scheduled 2 days ago/i)).toBeInTheDocument();
  });

  it('should highlight last scheduled label if a non-syndicated, not-a-collection item has been scheduled at any time in the past on the same surface', () => {
    const nonSyndicatedItem = getTestApprovedItem({
      isSyndicated: false,
      isCollection: false,
      scheduledSurfaceHistory: [
        {
          createdBy: 'ad|Mozilla-LDAP|aperson',
          externalId: 'bogus-external-id',
          scheduledDate: '2024-05-25',
          scheduledSurfaceGuid: 'NEW_TAB_EN_US',
        },
        {
          createdBy: 'ad|Mozilla-LDAP|bperson',
          externalId: 'useless-external-id',
          scheduledDate: '2024-01-01',
          scheduledSurfaceGuid: 'NEW_TAB_EN_US',
        },
      ],
    });

    render(
      <CorpusItemCardImage
        item={nonSyndicatedItem}
        isMlScheduled={false}
        currentScheduledDate="2024-05-25"
        scheduledSurfaceGuid="NEW_TAB_EN_US"
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
      />,
    );

    expect(screen.getByTestId('last-scheduled-overlay')).toHaveStyle({
      'background-color': curationPalette.solidPink,
    });
  });

  it('should highlight last scheduled label if a syndicated item has been scheduled up to two days ago on the same surface', () => {
    const syndicatedItem = getTestApprovedItem({
      isSyndicated: true,
      scheduledSurfaceHistory: [
        {
          createdBy: 'ad|Mozilla-LDAP|aperson',
          externalId: 'bogus-external-id',
          scheduledDate: '2024-05-25',
          scheduledSurfaceGuid: 'NEW_TAB_EN_US',
        },
        {
          createdBy: 'ad|Mozilla-LDAP|bperson',
          externalId: 'useless-external-id',
          scheduledDate: '2024-05-23',
          scheduledSurfaceGuid: 'NEW_TAB_EN_US',
        },
      ],
    });

    render(
      <CorpusItemCardImage
        item={syndicatedItem}
        isMlScheduled={false}
        currentScheduledDate="2024-05-25"
        scheduledSurfaceGuid="NEW_TAB_EN_US"
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
      />,
    );

    expect(screen.getByTestId('last-scheduled-overlay')).toHaveStyle({
      'background-color': curationPalette.solidPink,
    });
  });

  it('should NOT highlight last scheduled label if a syndicated item has been scheduled 3+ days ago on the same surface', () => {
    const syndicatedItem = getTestApprovedItem({
      isSyndicated: true,
      scheduledSurfaceHistory: [
        {
          createdBy: 'ad|Mozilla-LDAP|aperson',
          externalId: 'bogus-external-id',
          scheduledDate: '2024-05-25',
          scheduledSurfaceGuid: 'NEW_TAB_EN_US',
        },
        {
          createdBy: 'ad|Mozilla-LDAP|bperson',
          externalId: 'useless-external-id',
          scheduledDate: '2024-05-21',
          scheduledSurfaceGuid: 'NEW_TAB_EN_US',
        },
      ],
    });

    render(
      <CorpusItemCardImage
        item={syndicatedItem}
        isMlScheduled={false}
        currentScheduledDate="2024-05-25"
        scheduledSurfaceGuid="NEW_TAB_EN_US"
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
      />,
    );

    expect(screen.getByTestId('last-scheduled-overlay')).toHaveStyle({
      'background-color': curationPalette.overlayBgBlack,
    });
  });

  it('should highlight last scheduled label if collection has been scheduled up to two days ago on the same surface', () => {
    const collection = getTestApprovedItem({
      isCollection: true,
      scheduledSurfaceHistory: [
        {
          createdBy: 'ad|Mozilla-LDAP|aperson',
          externalId: 'bogus-external-id',
          scheduledDate: '2024-05-25',
          scheduledSurfaceGuid: 'NEW_TAB_EN_US',
        },
        {
          createdBy: 'ad|Mozilla-LDAP|bperson',
          externalId: 'useless-external-id',
          scheduledDate: '2024-05-23',
          scheduledSurfaceGuid: 'NEW_TAB_EN_US',
        },
      ],
    });

    render(
      <CorpusItemCardImage
        item={collection}
        isMlScheduled={false}
        currentScheduledDate="2024-05-25"
        scheduledSurfaceGuid="NEW_TAB_EN_US"
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
      />,
    );

    expect(screen.getByTestId('last-scheduled-overlay')).toHaveStyle({
      'background-color': curationPalette.solidPink,
    });
  });

  it('should NOT highlight last scheduled label if a collection has been scheduled 3+ days ago on the same surface', () => {
    const collection = getTestApprovedItem({
      isCollection: true,
      scheduledSurfaceHistory: [
        {
          createdBy: 'ad|Mozilla-LDAP|aperson',
          externalId: 'bogus-external-id',
          scheduledDate: '2024-05-25',
          scheduledSurfaceGuid: 'NEW_TAB_EN_US',
        },
        {
          createdBy: 'ad|Mozilla-LDAP|bperson',
          externalId: 'useless-external-id',
          scheduledDate: '2024-05-21',
          scheduledSurfaceGuid: 'NEW_TAB_EN_US',
        },
      ],
    });

    render(
      <CorpusItemCardImage
        item={collection}
        isMlScheduled={false}
        currentScheduledDate="2024-05-25"
        scheduledSurfaceGuid="NEW_TAB_EN_US"
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
      />,
    );

    expect(screen.getByTestId('last-scheduled-overlay')).toHaveStyle({
      'background-color': curationPalette.overlayBgBlack,
    });
  });

  it('should render a new domain warning label if item.hasTrustedDomain is false', () => {
    item = {
      ...item,
      hasTrustedDomain: false,
    };

    render(
      <CorpusItemCardImage
        item={item}
        isMlScheduled={false}
        currentScheduledDate={currentScheduledDate}
        scheduledSurfaceGuid="NEW_TAB_EN_US"
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
      />,
    );

    expect(screen.getByText(/NEW DOMAIN/i)).toBeVisible();
  });
});
