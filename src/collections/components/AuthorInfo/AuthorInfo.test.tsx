import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthorInfo } from './AuthorInfo';
import { CollectionAuthor } from '../../../api/generatedTypes';
import { MockedProvider } from '@apollo/client/testing';

describe('The AuthorInfo component', () => {
  let author: CollectionAuthor;

  beforeEach(() => {
    author = {
      externalId: '124abc',
      name: 'Nigel Rutherford',
      slug: 'nigel-rutherford',
      imageUrl: 'http://placeimg.com/640/480/people?random=494',
      bio:
        'Incidunt corrupti earum. Quasi aut qui magnam eum. ' +
        'Quia non dolores voluptatem est aut. Id officiis nulla est.\n \r' +
        'Harum et velit debitis. Quia assumenda commodi et dolor. ' +
        'Ut dicta veritatis perspiciatis suscipit. ' +
        'Aspernatur reprehenderit laboriosam voluptates ut. Ut minus aut est.',
      active: true,
    };
  });

  it('shows basic author information', () => {
    render(
      <MockedProvider>
        <MemoryRouter>
          <AuthorInfo author={author} />
        </MemoryRouter>
      </MockedProvider>,
    );

    // The author bio is present
    const bio = screen.getByText(/voluptatem est aut/i);
    expect(bio).toBeInTheDocument();
  });

  it('shows "active" status correctly', () => {
    render(
      <MockedProvider>
        <MemoryRouter>
          <AuthorInfo author={author} />
        </MemoryRouter>
      </MockedProvider>,
    );

    // Shows 'Active' subtitle for an active author
    const activeSubtitle = screen.getByText(/^active/i);
    expect(activeSubtitle).toBeInTheDocument();

    // Doesn't show 'Inactive' for an active author
    const inactiveSubtitle = screen.queryByText(/^inactive/i);
    expect(inactiveSubtitle).not.toBeInTheDocument();
  });

  it('shows "inactive" status correctly', () => {
    author.active = false;

    render(
      <MockedProvider>
        <MemoryRouter>
          <AuthorInfo author={author} />
        </MemoryRouter>
      </MockedProvider>,
    );

    // Shows 'Inactive' subtitle for an inactive author
    const inactiveSubtitle = screen.getByText(/^inactive/i);
    expect(inactiveSubtitle).toBeInTheDocument();

    // Doesn't show 'Active' for an inactive author
    const activeSubtitle = screen.queryByText(/^active/i);
    expect(activeSubtitle).not.toBeInTheDocument();
  });
});
