import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  ApprovedCuratedCorpusItem,
  CuratedStatus,
} from '../../api/curated-corpus-api/generatedTypes';
import { ApprovedItemListCard } from './ApprovedItemListCard';

describe('The ApprovedItemListCard component', () => {
  let item: ApprovedCuratedCorpusItem;
  const onSchedule = jest.fn();
  const onReject = jest.fn();

  beforeEach(() => {
    item = {
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
      isShortLived: false,
      createdAt: 1635014926,
      createdBy: 'Amy',
      updatedAt: 1635114926,
    };
  });

  it('shows basic approved item information', () => {
    render(
      <MemoryRouter>
        <ApprovedItemListCard
          item={item}
          onSchedule={onSchedule}
          onReject={onReject}
        />
      </MemoryRouter>
    );

    // The photo is present and the alt text is the item title
    const photo = screen.getByAltText(item.title);
    expect(photo).toBeInTheDocument();

    // The link to the approved item page is present and is well-formed
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining(item.url));

    // The excerpt is also present
    const excerpt = screen.getByText(/wanted to know about react/i);
    expect(excerpt).toBeInTheDocument();
  });

  it('shows curated status correctly', () => {
    render(
      <MemoryRouter>
        <ApprovedItemListCard
          item={item}
          onSchedule={onSchedule}
          onReject={onReject}
        />
      </MemoryRouter>
    );

    // Shows 'Recommendation' status for a recommended story
    const recommendation = screen.getByText(/^recommendation/i);
    expect(recommendation).toBeInTheDocument();

    // Doesn't show the other two possible curated item states
    const corpus = screen.queryByText(/^corpus/i);
    expect(corpus).not.toBeInTheDocument();
    const decline = screen.queryByText(/^decline/i);
    expect(decline).not.toBeInTheDocument();
  });

  it('shows language correctly', () => {
    render(
      <MemoryRouter>
        <ApprovedItemListCard
          item={item}
          onSchedule={onSchedule}
          onReject={onReject}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/^de$/i)).toBeInTheDocument();
  });
  it('should render approved item card with createdBy', () => {
    render(
      <MemoryRouter>
        <ApprovedItemListCard
          item={item}
          onSchedule={onSchedule}
          onReject={onReject}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(item.createdBy)).toBeInTheDocument();
  });

  it('should render approved item card with excerpt', () => {
    render(
      <MemoryRouter>
        <ApprovedItemListCard
          item={item}
          onSchedule={onSchedule}
          onReject={onReject}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(item.excerpt)).toBeInTheDocument();
  });

  it('should render approved item card with the action buttons', () => {
    render(
      <MemoryRouter>
        <ApprovedItemListCard
          item={item}
          onSchedule={onSchedule}
          onReject={onReject}
        />
      </MemoryRouter>
    );

    const scheduleButton = screen.getByRole('button', {
      name: /Schedule/i,
    });
    const rejectButton = screen.getByRole('button', {
      name: /Reject/i,
    });
    const editButton = screen.getByRole('button', {
      name: /Edit/i,
    });

    expect(scheduleButton).toBeInTheDocument();
    expect(rejectButton).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
  });
});
