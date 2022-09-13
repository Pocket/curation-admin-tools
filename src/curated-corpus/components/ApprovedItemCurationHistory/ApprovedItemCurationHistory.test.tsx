import React from 'react';
import { getTestApprovedItem } from '../../helpers/approvedItem';
import { ApprovedCorpusItem, CuratedStatus } from '../../../api/generatedTypes';
import { ApprovedItemCurationHistory } from './ApprovedItemCurationHistory';
import { render, screen } from '@testing-library/react';

describe('The ApprovedItemCurationHistory component', () => {
  const item: ApprovedCorpusItem = getTestApprovedItem({
    status: CuratedStatus.Recommendation,
    createdAt: 1660533276,
    createdBy: 'acurator',
    scheduledSurfaceHistory: [
      {
        createdBy: 'bcurator',
        externalId: '123-abc',

        scheduledDate: '2022-09-01',
        scheduledSurfaceGuid: 'NEW_TAB_EN_US',
      },
    ],
  });

  it('displays standard copy', () => {
    render(<ApprovedItemCurationHistory item={item} />);

    expect(screen.getByText(/curation history/i)).toBeInTheDocument();
    expect(screen.getByText(/schedule/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Note: up to ten most recent entries are displayed below/i
      )
    ).toBeInTheDocument();
  });

  it('displays item status and curation history', () => {
    render(<ApprovedItemCurationHistory item={item} />);

    expect(screen.getByText(/recommendation/i)).toBeInTheDocument();
    expect(screen.getByText(/acurator/i)).toBeInTheDocument();

    expect(screen.getByText(/august 14, 2022/i)).toBeInTheDocument();
  });

  it('displays scheduling history', () => {
    render(<ApprovedItemCurationHistory item={item} />);

    // Let's test just the one entry,
    expect(screen.getByText('New Tab (en-US)')).toBeInTheDocument();
    expect(screen.getByText('bcurator')).toBeInTheDocument();
    expect(screen.getByText(/september 1, 2022/i)).toBeInTheDocument();
  });
});
