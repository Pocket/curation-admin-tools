import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  CuratedStatus,
  ScheduledCuratedCorpusItemsResult,
} from '../../../api/generatedTypes';

import { ScheduledSurfaceGroupedList } from './ScheduledSurfaceGroupedList';

describe('The ScheduledSurfaceGroupedList component', () => {
  let data: ScheduledCuratedCorpusItemsResult;

  beforeEach(() => {
    const item = {
      externalId: '456-dfg',
      scheduledDate: '2030-01-01',
      createdAt: 1635014926,
      createdBy: 'Amy',
      updatedAt: 1635014927,
      updatedBy: 'Amy',
      approvedItem: {
        externalId: '123-abc',
        prospectId: '123-xyz',
        title: 'First story',
        url: 'http://www.test.com/how-to',
        imageUrl: 'https://placeimg.com/640/480/people?random=494',
        excerpt:
          'Everything You Wanted to Know About React and Were Afraid To Ask',
        language: 'de',
        publisher: 'Amazing Inventions',
        topic: 'Technology',
        status: CuratedStatus.Recommendation,
        isCollection: false,
        isSyndicated: false,
        isTimeSensitive: false,
        createdAt: 1635014926,
        createdBy: 'Amy',
        updatedAt: 1635114926,
      },
    };

    const secondItem = {
      ...item,
      externalId: '987-qwerty',
      isSyndicated: true,
      approvedItem: { ...item.approvedItem, title: 'Second story' },
    };

    data = {
      scheduledDate: '2050-01-01',
      totalCount: 2,
      syndicatedCount: 1,
      collectionCount: 0,
      items: [item, secondItem],
    };
  });

  it('shows the list heading correctly', () => {
    render(
      <MemoryRouter>
        <ScheduledSurfaceGroupedList data={data} />
      </MemoryRouter>
    );

    // The heading contains the correct date
    const heading = screen.getByText(/January 1, 2050/i);
    expect(heading).toBeInTheDocument();

    // The heading contains the right numbers for syndicated/total split
    const headingTakeTwo = screen.getByText(/1\/2 syndicated/i);
    expect(headingTakeTwo).toBeInTheDocument();
  });

  it('shows a card for each item in the list', () => {
    render(
      <MemoryRouter>
        <ScheduledSurfaceGroupedList data={data} />
      </MemoryRouter>
    );

    // There is a card (well, we're only checking for title here) for the first story
    const title1 = screen.getByText(data.items[0].approvedItem.title);
    expect(title1).toBeInTheDocument();

    // There is a card for the second story
    const title2 = screen.getByText(data.items[1].approvedItem.title);
    expect(title2).toBeInTheDocument();
  });
});
