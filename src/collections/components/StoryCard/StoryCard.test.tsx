import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StoryCard } from './StoryCard';
import { CollectionStory } from '../../../api/generatedTypes';
import { flattenAuthors } from '../../utils/flattenAuthors';

describe('The StoryCard component', () => {
  let story: CollectionStory;

  beforeEach(() => {
    story = {
      externalId: '124abc',
      title: 'Incidunt corrupti earum',
      url: 'https://getpocket.com/',
      imageUrl: 'http://placeimg.com/640/480/people?random=494',
      excerpt:
        'Quia non dolores voluptatem est aut. Id officiis nulla est.\n \r' +
        'Harum et velit debitis. Quia assumenda commodi et dolor. ' +
        'Ut dicta veritatis perspiciatis suscipit. \n \r' +
        'Aspernatur reprehenderit laboriosam voluptates ut. Ut minus aut est.',
      authors: [
        { name: 'Mary Shelley', sortOrder: 1 },
        { name: 'Percy Shelley', sortOrder: 2 },
      ],
      publisher: 'Lackington, Hughes, Harding, Mavor, & Jones',
      fromPartner: false,
    };
  });

  it('displays story information', () => {
    render(
      <MemoryRouter>
        <StoryCard story={story} />
      </MemoryRouter>
    );

    // The link to the story is present and well-formed
    const linkToStory = screen.getByRole('link');
    expect(linkToStory).toBeInTheDocument();
    expect(linkToStory).toHaveAttribute(
      'href',
      expect.stringMatching(story.url)
    );

    // the title is present
    const title = screen.getByText(story.title);
    expect(title).toBeInTheDocument();

    // the authors are presented in a comma-separated list
    const expectedAuthors = flattenAuthors(story.authors);
    const authors = screen.getByText(expectedAuthors);
    expect(authors).toBeInTheDocument();

    // the excerpt is present - looking for a partial match here
    // as the text is broken down by tags
    const excerpt = screen.getByText(/quia non dolores voluptatem est aut/i);
    expect(excerpt).toBeInTheDocument();

    // the publisher is present
    const publisher = screen.getByText(story.publisher!);
    expect(publisher).toBeInTheDocument();

    // The author bio is also present
    const bio = screen.getByText(/voluptatem est aut/i);
    expect(bio).toBeInTheDocument();
  });

  it('uses Markdown to display the story excerpt', () => {
    render(
      <MemoryRouter>
        <StoryCard story={story} />
      </MemoryRouter>
    );

    // The sample excerpt has some line breaks
    // and should be rendered as three paragraphs.
    const firstParagraph = screen.getByText(
      'Quia non dolores voluptatem est aut. Id officiis nulla est.'
    );
    expect(firstParagraph).toBeInTheDocument();

    const secondParagraph = screen.getByText(
      'Harum et velit debitis. Quia assumenda commodi et dolor. ' +
        'Ut dicta veritatis perspiciatis suscipit.'
    );
    expect(secondParagraph).toBeInTheDocument();

    const thirdParagraph = screen.getByText(
      'Aspernatur reprehenderit laboriosam voluptates ut. Ut minus aut est.'
    );
    expect(thirdParagraph).toBeInTheDocument();
  });

  it('shows the middot symbol when author is present', () => {
    render(
      <MemoryRouter>
        <StoryCard story={story} />
      </MemoryRouter>
    );

    const middot = screen.getByText('\u00b7');
    expect(middot).toBeInTheDocument();
  });

  it('omits the middot symbol if story has no authors', () => {
    story.authors = [];

    render(
      <MemoryRouter>
        <StoryCard story={story} />
      </MemoryRouter>
    );

    const middot = screen.queryByText('\u00b7');
    expect(middot).not.toBeInTheDocument();
  });

  it('displays "From partner/sponsor" if a story is sponsored', () => {
    story.fromPartner = true;

    render(
      <MemoryRouter>
        <StoryCard story={story} />
      </MemoryRouter>
    );

    const fromPartner = screen.getByText(/from partner\/sponsor/i);
    expect(fromPartner).toBeInTheDocument();
  });
});
