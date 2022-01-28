import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import { AuthorListCard } from './AuthorListCard';
import { CollectionAuthor } from '../../../api/generatedTypes';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

describe('The AuthorListCard component', () => {
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
      <MemoryRouter>
        <AuthorListCard author={author} />
      </MemoryRouter>
    );

    // The author photo is present and the alt text is the author's name
    const authorPhoto = screen.getByAltText(author.name);
    expect(authorPhoto).toBeInTheDocument();

    // The link to the author page is present and is well-formed
    const linkToAuthorPage = screen.getByRole('link');
    expect(linkToAuthorPage).toBeInTheDocument();
    expect(linkToAuthorPage).toHaveAttribute(
      'href',
      expect.stringContaining(author.externalId)
    );

    // The author bio is also present
    const bio = screen.getByText(/voluptatem est aut/i);
    expect(bio).toBeInTheDocument();
  });

  it('shows "active" status correctly', () => {
    render(
      <MemoryRouter>
        <AuthorListCard author={author} />
      </MemoryRouter>
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
      <MemoryRouter>
        <AuthorListCard author={author} />
      </MemoryRouter>
    );

    // Shows 'Inactive' subtitle for an inactive author
    const inactiveSubtitle = screen.getByText(/^inactive/i);
    expect(inactiveSubtitle).toBeInTheDocument();

    // Doesn't show 'Active' for an inactive author
    const activeSubtitle = screen.queryByText(/^active/i);
    expect(activeSubtitle).not.toBeInTheDocument();
  });

  it("links to an individual author's page", () => {
    const history = createMemoryHistory({
      initialEntries: ['/collections/authors/'],
    });

    render(
      <MockedProvider>
        <Router history={history}>
          <AuthorListCard author={author} />
        </Router>
      </MockedProvider>
    );

    // While the entire card is a giant link, we can click on
    // anything we like within that link - i.e., the author's name
    userEvent.click(screen.getByText(author.name));
    expect(history.location.pathname).toEqual(
      `/collections/authors/${author.externalId}/`
    );

    // Let's go back to the Authors page
    history.goBack();
    expect(history.location.pathname).toEqual('/collections/authors/');

    // And click on the image this time
    userEvent.click(screen.getByRole('img'));
    expect(history.location.pathname).toEqual(
      `/collections/authors/${author.externalId}/`
    );
  });
});
