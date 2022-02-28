import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  ApprovedCuratedCorpusItem,
  CuratedStatus,
} from '../../../api/generatedTypes';
import { ApprovedItemListCard } from './ApprovedItemListCard';

describe('The ApprovedItemListCard component', () => {
  let item: ApprovedCuratedCorpusItem;

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
      isTimeSensitive: false,
      createdAt: 1635014926,
      createdBy: 'Amy',
      updatedAt: 1635114926,
    };
  });

  it('shows basic approved item information', () => {
    render(
      <MemoryRouter>
        <ApprovedItemListCard item={item} />
      </MemoryRouter>
    );

    // The photo is present and the alt text is the item title
    const photo = screen.getByAltText(item.title);
    expect(photo).toBeInTheDocument();

    // The link to the approved item page is present and is well-formed
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining(item.url));
    // The link also opens in a new tab
    expect(link).toHaveAttribute('target', expect.stringContaining('_blank'));

    // The excerpt is also present
    const excerpt = screen.getByText(/wanted to know about react/i);
    expect(excerpt).toBeInTheDocument();
  });

  it('shows curated status correctly', () => {
    render(
      <MemoryRouter>
        <ApprovedItemListCard item={item} />
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
        <ApprovedItemListCard item={item} />
      </MemoryRouter>
    );

    expect(screen.getByText(/^de$/i)).toBeInTheDocument();
  });

  it('should render approved item card with excerpt', () => {
    render(
      <MemoryRouter>
        <ApprovedItemListCard item={item} />
      </MemoryRouter>
    );

    expect(screen.getByText(item.excerpt)).toBeInTheDocument();
  });

  it('should not render any extra flags if item does not have these props', () => {
    render(
      <MemoryRouter>
        <ApprovedItemListCard item={item} />
      </MemoryRouter>
    );

    expect(screen.queryByText(/collection/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/syndicated/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/time sensitive/i)).not.toBeInTheDocument();
  });

  it('should render any extra flags if item has these props set', () => {
    item = {
      ...item,
      isCollection: true,
      isTimeSensitive: true,
      isSyndicated: true,
    };

    render(
      <MemoryRouter>
        <ApprovedItemListCard item={item} />
      </MemoryRouter>
    );

    expect(screen.getByText(/collection/i)).toBeInTheDocument();
    expect(screen.getByText(/syndicated/i)).toBeInTheDocument();
    expect(screen.getByText(/time sensitive/i)).toBeInTheDocument();
  });
});
