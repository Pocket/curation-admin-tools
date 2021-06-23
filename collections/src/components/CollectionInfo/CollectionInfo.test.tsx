import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CollectionInfo } from './CollectionInfo';
import {
  Collection,
  CollectionStatus,
} from '../../api/collection-api/generatedTypes';

describe('The CollectionInfo component', () => {
  let collection: Omit<Collection, 'stories'>;

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
      authors: [],
    };
  });

  it('shows basic collection information', () => {
    render(
      <MemoryRouter>
        <CollectionInfo collection={collection} />
      </MemoryRouter>
    );

    // The slug is present
    const slug = screen.getByText(collection.slug);
    expect(slug).toBeInTheDocument();

    // The excerpt is present
    const excerpt = screen.getByText(/presidential ailments/i);
    expect(excerpt).toBeInTheDocument();
  });

  it('shows "Published" status correctly', () => {
    render(
      <MemoryRouter>
        <CollectionInfo collection={collection} />
      </MemoryRouter>
    );

    // Shows 'Published' subtitle for a published collection
    const published = screen.getByText(/^published/i);
    expect(published).toBeInTheDocument();

    // Doesn't show the other two possible collection states
    const draft = screen.queryByText(/^draft/i);
    expect(draft).not.toBeInTheDocument();
    const archived = screen.queryByText(/^archived/i);
    expect(archived).not.toBeInTheDocument();
  });

  it('shows label if curation category is set', () => {
    collection.curationCategory = {
      externalId: 'cde-234',
      name: 'Food',
      slug: 'food',
    };

    render(
      <MemoryRouter>
        <CollectionInfo collection={collection} />
      </MemoryRouter>
    );

    expect(screen.getByText('Food')).toBeInTheDocument();
  });

  it('omits label if curation category is not set', () => {
    render(
      <MemoryRouter>
        <CollectionInfo collection={collection} />
      </MemoryRouter>
    );

    expect(screen.queryByText('Food')).not.toBeInTheDocument();
  });

  it('shows IAB label if IAB categories are set is set', () => {
    collection.IABParentCategory = {
      externalId: 'cde-234',
      name: 'Careers',
      slug: 'careers',
    };

    collection.IABChildCategory = {
      externalId: 'cde-234',
      name: 'Job Fairs',
      slug: 'job-fairs',
    };

    render(
      <MemoryRouter>
        <CollectionInfo collection={collection} />
      </MemoryRouter>
    );

    expect(screen.getByText('Careers → Job Fairs')).toBeInTheDocument();
  });

  it('omits IAB label if IAB categories are not set', () => {
    render(
      <MemoryRouter>
        <CollectionInfo collection={collection} />
      </MemoryRouter>
    );

    expect(screen.queryByText('Careers → Job Fairs')).not.toBeInTheDocument();
  });
});
