import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  CorpusLanguage,
  RejectedCorpusItem,
} from '../../../api/generatedTypes';
import { RejectedItemListCard } from './RejectedItemListCard';

describe('The RejectedItemListCard component', () => {
  let rejectedItem: RejectedCorpusItem;

  beforeEach(() => {
    rejectedItem = {
      externalId: '123-abc',
      prospectId: '123-xyz',
      title: 'How To Win Friends And Influence People with React',
      url: 'http://www.test.com/how-to',
      language: CorpusLanguage.De,
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
        <RejectedItemListCard item={rejectedItem} />
      </MemoryRouter>,
    );

    // The link to the rejected item page is present and is well-formed
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining(rejectedItem.url),
    );
    // The link also opens in a new tab
    expect(link).toHaveAttribute('target', expect.stringContaining('_blank'));
  });

  it('should render rejected item card with language', () => {
    render(
      <MemoryRouter>
        <RejectedItemListCard item={rejectedItem} />
      </MemoryRouter>,
    );

    expect(screen.getByText(rejectedItem.language!)).toBeInTheDocument();
  });

  it('should render rejected item card with rejection reason', () => {
    render(
      <MemoryRouter>
        <RejectedItemListCard item={rejectedItem} />
      </MemoryRouter>,
    );

    expect(screen.getByText(rejectedItem.reason)).toBeInTheDocument();
  });

  it('should render rejected item card with the createdBy', () => {
    render(
      <MemoryRouter>
        <RejectedItemListCard item={rejectedItem} />
      </MemoryRouter>,
    );

    expect(screen.getByText(rejectedItem.createdBy)).toBeInTheDocument();
  });

  it('should render rejected item card with topic', () => {
    render(
      <MemoryRouter>
        <RejectedItemListCard item={rejectedItem} />
      </MemoryRouter>,
    );

    expect(screen.getByText(rejectedItem.topic!)).toBeInTheDocument();
  });

  it('should render rejected item card with publisher', () => {
    render(
      <MemoryRouter>
        <RejectedItemListCard item={rejectedItem} />
      </MemoryRouter>,
    );

    expect(screen.getByText(rejectedItem.publisher!)).toBeInTheDocument();
  });

  it('should render card with optional rejected item data missing', () => {
    rejectedItem = {
      ...rejectedItem,
      title: undefined,
      language: undefined,
      publisher: undefined,
      topic: undefined,
    };

    render(
      <MemoryRouter>
        <RejectedItemListCard item={rejectedItem} />
      </MemoryRouter>,
    );

    const placeholders = screen.getAllByText('N/A');
    expect(placeholders).toHaveLength(4);
  });
});
