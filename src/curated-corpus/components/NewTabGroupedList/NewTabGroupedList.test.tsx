import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  CuratedStatus,
  ScheduledCuratedCorpusItem,
} from '../../api/curated-corpus-api/generatedTypes';

import { NewTabGroupedList } from './NewTabGroupedList';
import { DateTime } from 'luxon';

describe('The MiniNewTabScheduleCard component', () => {
  let scheduledItems: ScheduledCuratedCorpusItem[];

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
        isShortLived: false,
        createdAt: 1635014926,
        createdBy: 'Amy',
        updatedAt: 1635114926,
      },
    };

    const secondItem = {
      ...item,
      externalId: '987-qwerty',
      approvedItem: { ...item.approvedItem, title: 'Second story' },
    };

    scheduledItems = [item, secondItem];
  });

  it('shows the "Today" heading for today\'s date', () => {
    render(
      <MemoryRouter>
        <NewTabGroupedList
          scheduledDate={DateTime.local().toFormat('yyyy-MM-dd')}
          scheduledItems={scheduledItems}
        />
      </MemoryRouter>
    );

    // The heading is "Today"
    const listHeading = screen.getByText(/today/i);
    expect(listHeading).toBeInTheDocument();
  });

  it('shows the "Tomorrow" heading for tomorrow\'s date', () => {
    render(
      <MemoryRouter>
        <NewTabGroupedList
          scheduledDate={DateTime.local()
            .plus({ days: 1 })
            .toFormat('yyyy-MM-dd')}
          scheduledItems={scheduledItems}
        />
      </MemoryRouter>
    );

    // The heading is "Tomorrow"
    const listHeading = screen.getByText(/tomorrow/i);
    expect(listHeading).toBeInTheDocument();
  });

  it('shows a date beyond today and tomorrow correctly', () => {
    render(
      <MemoryRouter>
        <NewTabGroupedList
          scheduledDate={'2050-01-01'}
          scheduledItems={scheduledItems}
        />
      </MemoryRouter>
    );

    // The heading is the correct date
    const listHeading = screen.getByText(/January 1, 2050/i);
    expect(listHeading).toBeInTheDocument();
  });

  it('shows a card for each item in the list', () => {
    render(
      <MemoryRouter>
        <NewTabGroupedList
          scheduledDate={'2050-01-01'}
          scheduledItems={scheduledItems}
        />
      </MemoryRouter>
    );

    // There is a card (well, we're only checking for title here) for the first story
    const title1 = screen.getByText(scheduledItems[0].approvedItem.title);
    expect(title1).toBeInTheDocument();

    // There is a card for the second story
    const title2 = screen.getByText(scheduledItems[1].approvedItem.title);
    expect(title2).toBeInTheDocument();
  });
});
