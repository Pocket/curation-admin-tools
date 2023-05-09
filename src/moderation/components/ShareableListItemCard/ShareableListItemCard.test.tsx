import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ShareableListItem } from '../../../api/generatedTypes';
import { ShareableListItemCard } from './ShareableListItemCard';

describe('The ShareableListItemCard component', () => {
  const listItem: ShareableListItem = {
    externalId: '123-abc',
    title: 'This is a story',
    url: 'https://this-is-a-domain.com/a-story',
    itemId: 123456789,
    excerpt: 'A short description of said story',
    imageUrl: 'https://image-domain.com/image.png',
    authors: 'A.B. Cdefg',
    publisher: 'Random Penguin',
    note: 'some note here',
    sortOrder: 0,
    createdAt: '2023-03-27T11:55:03.000Z',
    updatedAt: '2023-03-28T23:19:57.000Z',
  };

  it('displays list item information', () => {
    render(
      <MemoryRouter>
        <ShareableListItemCard listItem={listItem} />
      </MemoryRouter>
    );

    // The link to the story is present and well-formed
    const linkToStory = screen.getByRole('link');
    expect(linkToStory).toBeInTheDocument();
    expect(linkToStory).toHaveAttribute(
      'href',
      expect.stringMatching(listItem.url)
    );
    expect(linkToStory).toHaveAttribute(
      'target',
      expect.stringMatching('_blank')
    );

    // Asserting presence of props here as most fields on a list item are optional
    expect(screen.getByText(listItem.title!)).toBeInTheDocument();
    expect(screen.getByText(listItem.authors!)).toBeInTheDocument();

    const excerpt = screen.getByText(new RegExp(listItem.excerpt!, 'i'));
    expect(excerpt).toBeInTheDocument();

    expect(screen.getByText(listItem.publisher!)).toBeInTheDocument();

    const note = screen.getByText(/some note here/i);
    expect(note).toBeInTheDocument();

    // The image
    expect(screen.getByAltText(listItem.title!)).toBeInTheDocument();
  });

  it('substitutes placeholder text for missing list item properties', () => {
    const itemNoProps = {
      ...listItem,
      title: undefined,
      excerpt: undefined,
      authors: undefined,
      publisher: undefined,
    };

    render(
      <MemoryRouter>
        <ShareableListItemCard listItem={itemNoProps} />
      </MemoryRouter>
    );

    // Asserting presence of props here as most fields on a list item are optional
    expect(screen.getByText('No title')).toBeInTheDocument();
    expect(screen.getByText('No authors')).toBeInTheDocument();
    expect(screen.getByText('No excerpt')).toBeInTheDocument();
    expect(screen.getByText('No publisher')).toBeInTheDocument();
  });
});
