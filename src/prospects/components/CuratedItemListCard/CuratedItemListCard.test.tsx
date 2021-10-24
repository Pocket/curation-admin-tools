import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  CuratedItem,
  CuratedStatus,
} from '../../api/curated-corpus-api/generatedTypes';
import { CuratedItemListCard } from './CuratedItemListCard';

describe('The CuratedItemListCard component', () => {
  let item: CuratedItem;

  beforeEach(() => {
    item = {
      externalId: '123-abc',
      title: 'How To Win Friends And Influence People with React',
      url: 'http://www.test.com/how-to',
      imageUrl: 'https://placeimg.com/640/480/people?random=494',
      excerpt:
        'Everything You Wanted to Know About React and Were Afraid To Ask',
      language: 'de',
      status: CuratedStatus.Recommendation,
      createdAt: null,
      createdBy: 'Amy',
      updatedAt: null,
    };
  });

  it('shows basic curated item information', () => {
    render(
      <MemoryRouter>
        <CuratedItemListCard item={item} />
      </MemoryRouter>
    );

    // The photo is present and the alt text is the item title
    const photo = screen.getByAltText(item.title);
    expect(photo).toBeInTheDocument();

    // The link to the curated item page is present and is well-formed
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
        <CuratedItemListCard item={item} />
      </MemoryRouter>
    );

    // Shows 'Recommendation' status for a recommended storya
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
        <CuratedItemListCard item={item} />
      </MemoryRouter>
    );

    expect(screen.getByText(/^de$/i)).toBeInTheDocument();
  });
});
