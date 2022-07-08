import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  CorpusItemSource,
  CorpusLanguage,
  CuratedStatus,
  Prospect,
  ProspectType,
  Topics,
} from '../../../api/generatedTypes';
import { ExistingProspectCard } from './ExistingProspectCard';

describe('The ExistingProspectCard component', () => {
  let prospect: Prospect;
  const onSchedule = jest.fn();

  beforeEach(() => {
    prospect = {
      id: '123-abc',
      prospectId: '123-abc',
      title: 'How To Win Friends And Influence People with DynamoDB',
      scheduledSurfaceGuid: 'NEW_TAB_EN_US',
      prospectType: ProspectType.OrganicTimespent,
      url: 'http://www.test.com/how-to',
      imageUrl: 'https://placeimg.com/640/480/people?random=495',
      excerpt:
        'Everything You Wanted to Know About DynamoDB and Were Afraid To Ask',
      language: CorpusLanguage.De,
      publisher: 'Amazing Inventions',
      topic: Topics.Technology,
      approvedCorpusItem: {
        externalId: '456-cde',
        title: 'How To Win Friends And Influence People with DynamoDB',
        url: 'http://www.test.com/how-to',
        imageUrl: 'https://placeimg.com/640/480/people?random=495',
        excerpt:
          'Everything You Wanted to Know About DynamoDB and Were Afraid To Ask',
        language: CorpusLanguage.De,
        publisher: 'Amazing Inventions',
        topic: Topics.Technology,
        createdAt: 111,
        createdBy: 'sso|zorg',
        updatedAt: 111,
        updatedBy: 'sso|zorg',
        isCollection: false,
        isSyndicated: false,
        isTimeSensitive: false,
        source: CorpusItemSource.Prospect,
        status: CuratedStatus.Recommendation,
        scheduledSurfaceHistory: [],
      },
    };
  });

  it('shows basic prospect information', () => {
    render(
      <MemoryRouter>
        <ExistingProspectCard
          item={prospect.approvedCorpusItem!}
          onSchedule={onSchedule}
        />
      </MemoryRouter>
    );

    // The image is present and the alt text is the item title
    const photo = screen.getByAltText(prospect.title!);
    expect(photo).toBeInTheDocument();

    // The link to the prospect is present and well-formed
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining(prospect.url));
    // The link also opens in a new tab
    expect(link).toHaveAttribute('target', expect.stringContaining('_blank'));

    // The excerpt is also present
    const excerpt = screen.getByText(/wanted to know about dynamo/i);
    expect(excerpt).toBeInTheDocument();
  });

  it('shows language correctly', () => {
    render(
      <MemoryRouter>
        <ExistingProspectCard
          item={prospect.approvedCorpusItem!}
          onSchedule={onSchedule}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/^de$/i)).toBeInTheDocument();
  });

  it('shows topic correctly', () => {
    render(
      <MemoryRouter>
        <ExistingProspectCard
          item={prospect.approvedCorpusItem!}
          onSchedule={onSchedule}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/^technology$/i)).toBeInTheDocument();
  });

  it('should render card with excerpt', () => {
    render(
      <MemoryRouter>
        {' '}
        <ExistingProspectCard
          item={prospect.approvedCorpusItem!}
          onSchedule={onSchedule}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(prospect.excerpt!)).toBeInTheDocument();
  });

  it('should render curated item card with the action button', () => {
    render(
      <MemoryRouter>
        <ExistingProspectCard
          item={prospect.approvedCorpusItem!}
          onSchedule={onSchedule}
        />
      </MemoryRouter>
    );

    const scheduleButton = screen.getByRole('button', {
      name: /Schedule/i,
    });

    expect(scheduleButton).toBeInTheDocument();
  });
});
