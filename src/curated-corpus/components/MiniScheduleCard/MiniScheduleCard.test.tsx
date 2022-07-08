import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  CorpusLanguage,
  CorpusItemSource,
  CuratedStatus,
  ScheduledCorpusItem,
  Topics,
} from '../../../api/generatedTypes';

import { MiniScheduleCard } from './MiniScheduleCard';
import { getDisplayTopic } from '../../helpers/helperFunctions';

describe('The MiniScheduleCard component', () => {
  let item: ScheduledCorpusItem;

  beforeEach(() => {
    item = {
      externalId: '456-dfg',
      scheduledDate: '2030-01-01',
      createdAt: 1635014926,
      createdBy: 'Amy',
      updatedAt: 1635014927,
      updatedBy: 'Amy',
      scheduledSurfaceGuid: 'NEW_TAB_EN_US',
      approvedItem: {
        externalId: '123-abc',
        prospectId: '123-xyz',
        title: 'How To Win Friends And Influence People with React',
        url: 'http://www.test.com/how-to',
        imageUrl: 'https://placeimg.com/640/480/people?random=494',
        excerpt:
          'Everything You Wanted to Know About React and Were Afraid To Ask',
        language: CorpusLanguage.De,
        publisher: 'Amazing Inventions',
        topic: Topics.Technology,
        status: CuratedStatus.Recommendation,
        isCollection: false,
        isSyndicated: false,
        isTimeSensitive: false,
        createdAt: 1635014926,
        createdBy: 'Amy',
        updatedAt: 1635114926,
        scheduledSurfaceHistory: [],
        source: CorpusItemSource.Prospect,
      },
    };
  });

  it('shows basic scheduled item information', () => {
    render(
      <MemoryRouter>
        <MiniScheduleCard item={item} />
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
    // The link also opens in a new tab
    expect(link).toHaveAttribute('target', expect.stringContaining('_blank'));

    // There is a publisher on the page
    const publisher = screen.getByText(item.approvedItem.publisher);
    expect(publisher).toBeInTheDocument();

    // The topic is also present
    const displayTopic = getDisplayTopic(item.approvedItem.topic);
    const topic = screen.getByText(displayTopic);
    expect(topic).toBeInTheDocument();
  });

  it('does not show "Collection" or "Syndicated" tags if story does not have these properties', () => {
    render(
      <MemoryRouter>
        <MiniScheduleCard item={item} />
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
        <MiniScheduleCard item={item} />
      </MemoryRouter>
    );

    const tag = screen.getByText(/syndicated/i);
    expect(tag).toBeInTheDocument();
  });

  it('shows a "Collection" tag for scheduled collections', () => {
    item.approvedItem.isCollection = true;

    render(
      <MemoryRouter>
        <MiniScheduleCard item={item} />
      </MemoryRouter>
    );

    const tag = screen.getByText(/collection/i);
    expect(tag).toBeInTheDocument();
  });
});
