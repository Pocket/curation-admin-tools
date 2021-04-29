import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthorModel, CollectionModel, CollectionStatus } from '../../api';
import { CollectionForm } from './CollectionForm';

describe('The CollectionForm component', () => {
  let collection: CollectionModel;
  let authors: AuthorModel[];
  let handleSubmit = jest.fn();

  beforeEach(() => {
    collection = {
      externalId: '124abc',
      title: 'Collection of Collections',
      slug: 'collection-of-collections',
      imageUrl: 'http://placeimg.com/640/480/nature?random=494',
      excerpt:
        'Incidunt corrupti earum. Quasi aut qui magnam eum. ' +
        'Quia non dolores voluptatem est aut. Id officiis nulla est.\n \r' +
        'Harum et velit debitis. Quia assumenda commodi et dolor. ',
      intro:
        ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
        'Nulla sed ultricies odio. Ut egestas urna neque, nec viverra risus' +
        ' egestas id. Nulla eget felis quis enim blandit vehicula. Donec ac ' +
        'semper diam. Aenean eu sapien ornare, venenatis metus a, euismod metus.' +
        ' Maecenas ullamcorper, nunc eu rhoncus luctus, ante augue lobortis nisi,' +
        ' eu imperdiet est nisi non sapien. Pellentesque habitant morbi tristique' +
        ' senectus et netus et malesuada fames ac turpis egestas.\n' +
        '\n' +
        'Etiam vel maximus diam, hendrerit egestas augue. Etiam vel tincidunt ' +
        'mauris. Duis et elit quis nisl commodo sodales ut at dui. Aenean blandit' +
        ' pellentesque aliquam. Mauris nec hendrerit lacus, et ultricies magna.' +
        ' Praesent hendrerit eros luctus ligula facilisis, non sodales est ' +
        'suscipit. Nunc a lorem a metus venenatis euismod. Praesent id lectus' +
        ' lobortis, ullamcorper ipsum in, eleifend sapien.',
      status: CollectionStatus.Draft,
    };

    authors = [
      {
        externalId: '123abc',
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
      },
    ];
  });

  it('renders successfully', () => {
    render(
      <CollectionForm
        collection={collection}
        authors={authors}
        onSubmit={handleSubmit}
      />
    );

    // there is at least a form and nothing falls over
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('shows three action buttons by default', () => {
    render(
      <CollectionForm
        collection={collection}
        authors={authors}
        onSubmit={handleSubmit}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toEqual(3);
  });

  it('only shows two buttons if cancel button is not requested', () => {
    render(
      <CollectionForm
        collection={collection}
        authors={authors}
        onSubmit={handleSubmit}
        showCancelButton={false}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toEqual(2);
  });

  it('displays collection information', () => {
    render(
      <CollectionForm
        collection={collection}
        authors={authors}
        onSubmit={handleSubmit}
      />
    );

    const titleField = screen.getByLabelText('Title');
    expect(titleField).toBeInTheDocument();

    const slugField = screen.getByLabelText('Slug');
    expect(slugField).toBeInTheDocument();

    const statusField = screen.getByLabelText('Status');
    expect(statusField).toBeInTheDocument();

    const authorField = screen.getByLabelText('Author');
    expect(authorField).toBeInTheDocument();

    const excerptField = screen.getByLabelText('Excerpt');
    expect(excerptField).toBeInTheDocument();

    const introField = screen.getByLabelText('Intro');
    expect(introField).toBeInTheDocument();
  });

  it('validates the "title" field', async () => {
    render(
      <CollectionForm
        collection={collection}
        authors={authors}
        onSubmit={handleSubmit}
      />
    );

    const titleField = screen.getByLabelText(/title/i);
    const saveButton = screen.getByText(/save/i);

    // Submit an empty field
    userEvent.clear(titleField);
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter a title for this collection/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/title must be at least 6 characters/i)
    ).not.toBeInTheDocument();

    // Submit a collection title that is too short (under 6 characters)
    userEvent.type(titleField, 'All');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter a title for this collection/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/title must be at least 6 characters/i)
    ).toBeInTheDocument();

    // Submit a title that satisfies all the requirements
    userEvent.type(titleField, 'All About Standing Desks');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter a title for this collection/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/title must be at least 6 characters/i)
    ).not.toBeInTheDocument();
  });

  it('validates the "slug" field', async () => {
    render(
      <CollectionForm
        collection={collection}
        authors={authors}
        onSubmit={handleSubmit}
      />
    );

    const slugField = screen.getByLabelText(/slug/i);
    const saveButton = screen.getByText(/save/i);

    // Submit an empty field
    userEvent.clear(slugField);
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(screen.queryByText(/please enter a slug/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/slug must be at least 6 characters/i)
    ).not.toBeInTheDocument();

    // Submit a slug that is too short (under 6 characters)
    userEvent.type(slugField, 'q-bee');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(screen.queryByText(/please enter a slug/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/slug must be at least 6 characters/i)
    ).toBeInTheDocument();

    // Submit a slug that satisfies all the requirements
    userEvent.type(slugField, 'queen-bee');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(screen.queryByText(/please enter a slug/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/slug must be at least 6 characters/i)
    ).not.toBeInTheDocument();
  });

  it('suggests the slug correctly', async () => {
    render(
      <CollectionForm
        collection={collection}
        authors={authors}
        onSubmit={handleSubmit}
      />
    );

    // The "Suggest slug" button slugifies whatever is present in the "Title" field
    const slugField = screen.getByLabelText(/slug/i);
    const titleField = screen.getByLabelText(/title/i);
    const suggestSlugButton = screen.getByText(/suggest slug/i);

    // Try with an empty field first
    userEvent.clear(slugField);
    userEvent.clear(titleField);

    await waitFor(() => {
      userEvent.click(suggestSlugButton);
    });

    // Slugify button returned an empty string
    expect(slugField).toHaveTextContent('');

    // Try with an actual title
    userEvent.type(titleField, 'A Very Long And Elaborate Collection Name');

    await waitFor(() => {
      userEvent.click(suggestSlugButton);
    });

    // Slugified version of the title appears in the slug input field
    expect(
      screen.getByDisplayValue('a-very-long-and-elaborate-collection-name')
    ).toBeInTheDocument();
  });

  it('has markdown preview tabs on two fields', () => {
    render(
      <CollectionForm
        collection={collection}
        authors={authors}
        onSubmit={handleSubmit}
      />
    );

    const writeTabs = screen.getAllByText(/write/i);
    expect(writeTabs.length).toEqual(2);

    const previewTabs = screen.getAllByText(/preview/i);
    expect(previewTabs.length).toEqual(2);
  });
});
