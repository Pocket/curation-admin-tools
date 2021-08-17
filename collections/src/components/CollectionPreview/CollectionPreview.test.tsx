import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CollectionPreview } from './CollectionPreview';
import {
  Collection,
  CollectionPartnerAssociation,
  CollectionPartnershipType,
  CollectionStatus,
  CollectionStory,
} from '../../api/collection-api/generatedTypes';

describe('The CollectionPreview component', () => {
  let collection: Omit<Collection, 'stories'>;
  let stories: CollectionStory[];
  let association: CollectionPartnerAssociation;

  beforeEach(() => {
    collection = {
      externalId: '124abc',
      title: 'Hidden Histories of Presidential Medical Dramas',
      slug: 'collection-slug',
      imageUrl: 'https://placeimg.com/640/480/people?random=494',
      excerpt:
        'There’s a long history of presidential ailments, including George Washington’s near-death encounter with the flu, Grover Cleveland’s secret tumor, and the clandestine suffering of John F. Kennedy. ',
      intro: 'Intro text is generally longer than the excerpt.',
      language: 'en',
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
        publisher: 'Pocket Articles',
        fromPartner: false,
      },
    ];
  });

  it('shows basic collection information', () => {
    render(
      <MemoryRouter>
        <CollectionPreview
          collection={collection}
          stories={stories}
          association={null}
        />
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
        <CollectionPreview
          collection={collection}
          stories={stories}
          association={null}
        />
      </MemoryRouter>
    );

    // Displays authors as a comma-separated list
    const authors = screen.getByText('Collection Author, Another Author');
    expect(authors).toBeInTheDocument();
  });

  it('shows collection stories', () => {
    render(
      <MemoryRouter>
        <CollectionPreview
          collection={collection}
          stories={stories}
          association={null}
        />
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

  it('shows sponsored stories', () => {
    // Add a second, sponsored story
    stories.push({
      externalId: '456-cde',
      title: 'The second story in this collection',
      url: 'https://www.test.com/sponsored-story',
      excerpt: 'This story should show the "from partner" flag.',
      authors: [{ name: 'John Citizen', sortOrder: 1 }],
      publisher: 'Pocket Sponsor',
      fromPartner: true,
    });

    render(
      <MemoryRouter>
        <CollectionPreview
          collection={collection}
          stories={stories}
          association={null}
        />
      </MemoryRouter>
    );

    // Out of the two stories in the mock data, only one is sponsored
    const sponsoredStories = screen.getAllByText(/from partner/i);
    expect(sponsoredStories.length).toEqual(1);
  });

  it('shows partnership information', () => {
    // A minimal collection-partnership association with default values only
    association = {
      externalId: '123-abc',
      type: CollectionPartnershipType.Sponsored,
      partner: {
        externalId: '789-qwe',
        name: 'Bushwalking Paradise',
        url: 'https://www.getpocket.com/',
        imageUrl: 'https://www.example.com/image.png',
        blurb: 'Visit us to experience a bushwalking paradise!',
      },
    };

    const { rerender } = render(
      <MemoryRouter>
        <CollectionPreview
          collection={collection}
          stories={stories}
          association={association}
        />
      </MemoryRouter>
    );

    let sponsoredCopy: HTMLElement | null =
      screen.getByText(/brought to you by/i);
    expect(sponsoredCopy).toBeInTheDocument();

    const partnerImage = screen.getByAltText(association.partner.name);
    expect(partnerImage).toBeInTheDocument();

    // Now let's update the partnership type to test the other copy
    association.type = CollectionPartnershipType.Partnered;

    rerender(
      <MemoryRouter>
        <CollectionPreview
          collection={collection}
          stories={stories}
          association={association}
        />
      </MemoryRouter>
    );

    // The partnership type copy should reflect the change
    const partneredCopy = screen.getByText(/in partnership with/i);
    expect(partneredCopy).toBeInTheDocument();

    // And we shouldn't see the old copy
    sponsoredCopy = screen.queryByText(/brought to you by/i);
    expect(sponsoredCopy).not.toBeInTheDocument();
  });
});
