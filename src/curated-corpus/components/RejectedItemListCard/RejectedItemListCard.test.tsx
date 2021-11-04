import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RejectedCuratedCorpusItem } from '../../api/curated-corpus-api/generatedTypes';
import { RejectedCuratedItemListCard } from './RejectedItemListCard';

describe('The RejectedItemListCard component', () => {
  let rejectedItem: RejectedCuratedCorpusItem;

  beforeEach(() => {
    rejectedItem = {
      externalId: '123-abc',
      title: 'How To Win Friends And Influence People with React',
      url: 'http://www.test.com/how-to',
      language: 'DE',
      publisher: 'Amazing Inventions',
      topic: 'Technology',
      createdAt: 1635014926,
      reason: 'Paywall',
      createdBy: 'Amy',
    };
  });

  it('should render rejected item card with title link', () => {
    render(
      <MemoryRouter>
        <RejectedCuratedItemListCard item={rejectedItem} />
      </MemoryRouter>
    );

    // The link to the rejected item page is present and is well-formed
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining(rejectedItem.url)
    );
  });

  it('should render rejected item card with language', () => {
    render(
      <MemoryRouter>
        <RejectedCuratedItemListCard item={rejectedItem} />
      </MemoryRouter>
    );

    expect(screen.getByText(rejectedItem.language)).toBeInTheDocument();
  });

  it('should render rejected item card with reason', () => {
    render(
      <MemoryRouter>
        <RejectedCuratedItemListCard item={rejectedItem} />
      </MemoryRouter>
    );

    expect(screen.getByText(rejectedItem.reason)).toBeInTheDocument();
  });

  it('should render rejected item card with the createdBy', () => {
    render(
      <MemoryRouter>
        <RejectedCuratedItemListCard item={rejectedItem} />
      </MemoryRouter>
    );

    expect(screen.getByText(rejectedItem.createdBy)).toBeInTheDocument();
  });

  it('should render rejected item card with topic', () => {
    render(
      <MemoryRouter>
        <RejectedCuratedItemListCard item={rejectedItem} />
      </MemoryRouter>
    );

    expect(screen.getByText(rejectedItem.topic)).toBeInTheDocument();
  });
});
