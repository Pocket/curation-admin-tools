import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CollectionPreview } from './CollectionPreview';
import {
  CollectionModel,
  CollectionStatus,
  StoryModel,
} from '../../api/collection-api';

describe('The CollectionPreview component', () => {
  let collection: CollectionModel;
  let stories: StoryModel[];

  beforeEach(() => {
    collection = {
      externalId: '124abc',
      title: 'Hidden Histories of Presidential Medical Dramas',
      slug: 'collection-slug',
      imageUrl: 'https://placeimg.com/640/480/people?random=494',
      excerpt:
        'There’s a long history of presidential ailments, including George Washington’s near-death encounter with the flu, Grover Cleveland’s secret tumor, and the clandestine suffering of John F. Kennedy. ',
      intro: 'Intro text is generally longer than the excerpt.',
      status: CollectionStatus.Published,
      authors: [
        {
          externalId: '456-abc',
          name: 'Collection Author',
          slug: 'collection-author',
          active: true,
        },
      ],
    };

    stories = [
      {
        externalId: '123-abc',
        title: 'The first story in this collection',
        url: 'https://www.test.com/',
        excerpt: 'This story should always be the first.',
        authors: [{ name: 'First Author', sortOrder: 1 }],
        publisher: 'Pocket Collections',
      },
    ];
  });

  it('shows basic collection information', () => {
    render(
      <MemoryRouter>
        <CollectionPreview collection={collection} stories={stories} />
      </MemoryRouter>
    );

    // The title is present
    const title = screen.getByText(collection.title);
    expect(title).toBeInTheDocument();

    // So is the excerpt
    const excerpt = screen.getByText(/presidential ailments/i);
    expect(excerpt).toBeInTheDocument();

    // And the intro
    const intro = screen.getByText(/intro text is/i);
    expect(intro).toBeInTheDocument();

    // Shows a single collection author correctly
    const authors = screen.getByText(collection.authors[0].name);
    expect(authors).toBeInTheDocument();

    // collection image alt text is the title of the collection
    const image = screen.getByAltText(collection.title);
    expect(image).toBeInTheDocument();
  });

  it('shows multiple collection authors correctly', () => {
    // Add a second author
    collection.authors.push({
      externalId: '789-zzz',
      name: 'Another Author',
      slug: 'another-author',
      active: true,
    });

    render(
      <MemoryRouter>
        <CollectionPreview collection={collection} stories={stories} />
      </MemoryRouter>
    );

    // Displays authors as a comma-separated list
    const authors = screen.getByText('Collection Author, Another Author');
    expect(authors).toBeInTheDocument();
  });

  it('shows collection stories', () => {
    render(
      <MemoryRouter>
        <CollectionPreview collection={collection} stories={stories} />
      </MemoryRouter>
    );

    // Displays story title
    const storyTitle = screen.getByText(stories[0].title);
    expect(storyTitle).toBeInTheDocument();

    // Displays story excerpt
    const storyExcerpt = screen.getByText(stories[0].excerpt);
    expect(storyExcerpt).toBeInTheDocument();

    // Displays story publisher
    const storyPublisher = screen.getByText(stories[0].publisher!);
    expect(storyPublisher).toBeInTheDocument();

    // Displays story authors
    const storyAuthors = screen.getByText(stories[0].authors[0].name);
    expect(storyAuthors).toBeInTheDocument();

    // story image alt text is the title of the story
    const image = screen.getByAltText(stories[0].title);
    expect(image).toBeInTheDocument();
  });
});
