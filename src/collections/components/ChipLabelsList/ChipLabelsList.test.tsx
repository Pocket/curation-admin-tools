import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { ChipLabelsList } from './ChipLabelsList';
import {
  Collection,
  CollectionLanguage,
  CollectionStatus,
} from '../../../api/generatedTypes';

describe('The ChipLabelsList component', () => {
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
      language: CollectionLanguage.De,
      status: CollectionStatus.Draft,
      authors: [{ externalId: '123-abc', name: 'Joe Bloggs', active: true }],
    };
  });

  it('shows label if labels are set', () => {
    collection.labels = [
      {
        externalId: 'label-1',
        name: 'region-east-africa',
      },
      {
        externalId: 'label-2',
        name: 'region-west-africa',
      },
    ];

    render(
      <MemoryRouter>
        <ChipLabelsList collection={collection} />
      </MemoryRouter>,
    );

    expect(screen.getByText('region-east-africa')).toBeInTheDocument();
    expect(screen.getByText('region-west-africa')).toBeInTheDocument();
  });

  it('shows 2 out of 3 labels, click on expand button and show one more label', () => {
    collection.labels = [
      {
        externalId: 'label-1',
        name: 'region-east-africa',
      },
      {
        externalId: 'label-2',
        name: 'region-west-africa',
      },
      {
        externalId: 'label-3',
        name: 'region-south-africa',
      },
    ];

    render(
      <MemoryRouter>
        <ChipLabelsList collection={collection} />
      </MemoryRouter>,
    );

    // grab expand button, expect +1 as there are total of 3 labels
    const expandButton = screen.getByRole('button', {
      name: /\+ 1/i,
    });
    expect(expandButton).toBeInTheDocument();

    // click on the expand button
    userEvent.click(expandButton);

    expect(screen.getByText('region-east-africa')).toBeInTheDocument();
    expect(screen.getByText('region-west-africa')).toBeInTheDocument();
    expect(screen.getByText('region-south-africa')).toBeInTheDocument();
  });

  it('shows 2 out of 3 labels, one label is hidden', () => {
    collection.labels = [
      {
        externalId: 'label-1',
        name: 'region-east-africa',
      },
      {
        externalId: 'label-2',
        name: 'region-west-africa',
      },
      {
        externalId: 'label-3',
        name: 'region-south-africa',
      },
    ];

    render(
      <MemoryRouter>
        <ChipLabelsList collection={collection} />
      </MemoryRouter>,
    );

    // grab expand button, expect +1 as there are total of 3 labels
    const expandButton = screen.getByRole('button', {
      name: /\+ 1/i,
    });
    expect(expandButton).toBeInTheDocument();

    expect(screen.getByText('region-east-africa')).toBeInTheDocument();
    expect(screen.getByText('region-west-africa')).toBeInTheDocument();
    // expand button not clicked, don't expect this label to shown
    expect(screen.queryByText('region-south-africa')).not.toBeInTheDocument();
  });

  it('omits label if labels are not set', () => {
    render(
      <MemoryRouter>
        <ChipLabelsList collection={collection} />
      </MemoryRouter>,
    );

    expect(screen.queryByText('region-east-africa')).not.toBeInTheDocument();
  });
});
