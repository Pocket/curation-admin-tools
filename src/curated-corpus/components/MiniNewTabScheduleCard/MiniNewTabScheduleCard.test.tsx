import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  CuratedStatus,
  ScheduledCuratedCorpusItem,
} from '../../api/curated-corpus-api/generatedTypes';

import { MiniNewTabScheduleCard } from './MiniNewTabScheduleCard';

describe('The MiniNewTabScheduleCard component', () => {
  let item: ScheduledCuratedCorpusItem;

  beforeEach(() => {
    item = {
      externalId: '456-dfg',
      scheduledDate: '2030-01-01',
      createdAt: 1635014926,
      createdBy: 'Amy',
      updatedAt: 1635014927,
      updatedBy: 'Amy',
      approvedItem: {
        externalId: '123-abc',
        prospectId: '123-xyz',
        title: 'How To Win Friends And Influence People with React',
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
  });

  it('shows basic scheduled item information', () => {
    render(
      <MemoryRouter>
        <MiniNewTabScheduleCard item={item} />
      </MemoryRouter>
    );

    // The title of the scheduled story is present
    const title = screen.getByText(item.approvedItem.title);
    expect(title).toBeInTheDocument();

    // The link to the scheduled story is present and is well-formed
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining(item.approvedItem.url)
    );

    // There is a publisher on the page
    const publisher = screen.getByText(item.approvedItem.publisher);
    expect(publisher).toBeInTheDocument();

    // The topic is also present
    const topic = screen.getByText(item.approvedItem.topic.toLowerCase());
    expect(topic).toBeInTheDocument();
  });

  it('does not show "Collection" or "Syndicated" tags if story does not have these properties', () => {
    render(
      <MemoryRouter>
        <MiniNewTabScheduleCard item={item} />
      </MemoryRouter>
    );

    const tag = screen.queryByText(/collection/i);
    expect(tag).not.toBeInTheDocument();

    const tag2 = screen.queryByText(/syndicated/i);
    expect(tag2).not.toBeInTheDocument();
  });

  it('shows a "Syndicated" tag for syndicated articles', () => {
    item.approvedItem.isSyndicated = true;

    render(
      <MemoryRouter>
        <MiniNewTabScheduleCard item={item} />
      </MemoryRouter>
    );

    const tag = screen.getByText(/syndicated/i);
    expect(tag).toBeInTheDocument();
  });

  it('shows a "Collection" tag for scheduled collections', () => {
    item.approvedItem.isCollection = true;

    render(
      <MemoryRouter>
        <MiniNewTabScheduleCard item={item} />
      </MemoryRouter>
    );

    const tag = screen.getByText(/collection/i);
    expect(tag).toBeInTheDocument();
  });
});
