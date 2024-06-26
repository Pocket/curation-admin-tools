import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CollectionForm } from './CollectionForm';
import {
  Collection,
  CollectionAuthor,
  CollectionLanguage,
  CollectionStatus,
  CurationCategory,
  IabParentCategory,
  Label,
} from '../../../api/generatedTypes';

describe('The CollectionForm component', () => {
  let collection: Omit<Collection, 'stories'>;
  let authors: CollectionAuthor[];
  let curationCategories: CurationCategory[];
  let iabCategories: IabParentCategory[];
  let labels: Label[];
  let languages: CollectionLanguage[];
  const handleSubmit = jest.fn();

  // This test suite occasionally takes forever to run on a local machine
  jest.setTimeout(10000);

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
      language: CollectionLanguage.De,
      status: CollectionStatus.Draft,
      authors: [],
      curationCategory: { externalId: 'cde-234', name: 'Food', slug: 'food' },
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

    curationCategories = [
      {
        externalId: 'abc-123',
        name: 'Business',
        slug: 'business',
      },
      { externalId: 'cde-234', name: 'Food', slug: 'food' },
    ];

    iabCategories = [
      {
        externalId: 'abc-345',
        name: 'Education',
        slug: 'education',
        children: [
          {
            externalId: '123-abc',
            name: 'Language Learning',
            slug: 'language-learning',
          },
        ],
      },
    ];

    labels = [
      { externalId: '345-dfg', name: 'test-label-one' },
      { externalId: '789-yui', name: 'test-label-two' },
    ];

    languages = Object.values(CollectionLanguage);
  });

  it('renders successfully', () => {
    render(
      <CollectionForm
        authors={authors}
        collection={collection}
        curationCategories={curationCategories}
        iabCategories={iabCategories}
        labels={labels}
        languages={Object.values(CollectionLanguage)}
        onSubmit={handleSubmit}
      />,
    );

    // there is at least a form and nothing falls over
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('shows six action buttons by default', () => {
    render(
      <CollectionForm
        authors={authors}
        collection={collection}
        curationCategories={curationCategories}
        iabCategories={iabCategories}
        labels={labels}
        languages={languages}
        onSubmit={handleSubmit}
      />,
    );

    const buttons = screen.getAllByRole('button');

    // The seventh button is part of the MUI Autocomplete component
    expect(buttons.length).toEqual(7);
  });

  it('only shows five buttons if not in edit mode', () => {
    render(
      <CollectionForm
        authors={authors}
        collection={collection}
        curationCategories={curationCategories}
        iabCategories={iabCategories}
        labels={labels}
        languages={languages}
        editMode={false}
        onSubmit={handleSubmit}
      />,
    );

    const buttons = screen.getAllByRole('button');

    // The sixth button is part of the MUI Autocomplete component
    expect(buttons.length).toEqual(6);
  });

  it('displays collection information', () => {
    render(
      <CollectionForm
        authors={authors}
        collection={collection}
        curationCategories={curationCategories}
        iabCategories={iabCategories}
        labels={labels}
        languages={languages}
        onSubmit={handleSubmit}
      />,
    );

    const titleField = screen.getByLabelText('Title');
    expect(titleField).toBeInTheDocument();

    const slugField = screen.getByLabelText('Slug');
    expect(slugField).toBeInTheDocument();

    const statusField = screen.getByLabelText('Status');
    expect(statusField).toBeInTheDocument();

    const languageField = screen.getByLabelText('Language Code');
    expect(languageField).toBeInTheDocument();

    const authorField = screen.getByLabelText('Author');
    expect(authorField).toBeInTheDocument();

    const excerptField = screen.getByLabelText('Excerpt');
    expect(excerptField).toBeInTheDocument();

    const introField = screen.getByLabelText('Intro');
    expect(introField).toBeInTheDocument();

    const curationCategoryField = screen.getByLabelText('Curation Category');
    expect(curationCategoryField).toBeInTheDocument();

    const iabParentCategoryField = screen.getByLabelText('IAB Parent Category');
    expect(iabParentCategoryField).toBeInTheDocument();

    const iabChildCategoryField = screen.getByLabelText('IAB Child Category');
    expect(iabChildCategoryField).toBeInTheDocument();
  });

  it('validates the "title" field', async () => {
    render(
      <CollectionForm
        authors={authors}
        collection={collection}
        curationCategories={curationCategories}
        iabCategories={iabCategories}
        labels={labels}
        languages={languages}
        onSubmit={handleSubmit}
      />,
    );

    const titleField = screen.getByLabelText(/title/i);
    const saveButton = screen.getByText(/save/i);

    // Submit an empty field
    userEvent.clear(titleField);
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter a title for this collection/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/title must be at least 6 characters/i),
    ).not.toBeInTheDocument();

    // Submit a collection title that is too short (under 6 characters)
    userEvent.type(titleField, 'All');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter a title for this collection/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/title must be at least 6 characters/i),
    ).toBeInTheDocument();

    // Submit a title that satisfies all the requirements
    userEvent.type(titleField, 'All About Standing Desks');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter a title for this collection/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/title must be at least 6 characters/i),
    ).not.toBeInTheDocument();
  });

  it('validates the "slug" field', async () => {
    render(
      <CollectionForm
        authors={authors}
        collection={collection}
        curationCategories={curationCategories}
        iabCategories={iabCategories}
        labels={labels}
        languages={languages}
        onSubmit={handleSubmit}
      />,
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
      screen.queryByText(/slug must be at least 6 characters/i),
    ).not.toBeInTheDocument();

    // Submit a slug that is too short (under 6 characters)
    userEvent.type(slugField, 'q-bee');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(screen.queryByText(/please enter a slug/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/slug must be at least 6 characters/i),
    ).toBeInTheDocument();

    // Submit a slug that satisfies all the requirements
    userEvent.type(slugField, 'queen-bee');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(screen.queryByText(/please enter a slug/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/slug must be at least 6 characters/i),
    ).not.toBeInTheDocument();
  });

  it('suggests the slug correctly', async () => {
    render(
      <CollectionForm
        authors={authors}
        collection={collection}
        curationCategories={curationCategories}
        iabCategories={iabCategories}
        labels={labels}
        languages={languages}
        onSubmit={handleSubmit}
      />,
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
      screen.getByDisplayValue('a-very-long-and-elaborate-collection-name'),
    ).toBeInTheDocument();
  });

  it('suggests a slug free of punctuation and other special characters', async () => {
    render(
      <CollectionForm
        authors={authors}
        collection={collection}
        curationCategories={curationCategories}
        iabCategories={iabCategories}
        labels={labels}
        languages={languages}
        onSubmit={handleSubmit}
      />,
    );

    const slugField = screen.getByLabelText(/slug/i);
    const titleField = screen.getByLabelText(/title/i);
    const suggestSlugButton = screen.getByText(/suggest slug/i);

    // Clear the fields or the user event further on will add to the input
    // rather than overwrite it
    userEvent.clear(slugField);
    userEvent.clear(titleField);

    userEvent.type(
      titleField,
      'A !!!title ??? full ### of ```special~~~ chars!#@*^*#^.,;*_/',
    );

    await waitFor(() => {
      userEvent.click(suggestSlugButton);
    });

    // Get a slug that is free
    expect(
      screen.getByDisplayValue('a-title-full-of-special-chars'),
    ).toBeInTheDocument();
  });

  it('has markdown preview tabs on two fields', () => {
    render(
      <CollectionForm
        authors={authors}
        collection={collection}
        curationCategories={curationCategories}
        iabCategories={iabCategories}
        labels={labels}
        languages={languages}
        onSubmit={handleSubmit}
      />,
    );

    const writeTabs = screen.getAllByText(/write/i);
    expect(writeTabs.length).toEqual(2);

    const previewTabs = screen.getAllByText(/preview/i);
    expect(previewTabs.length).toEqual(2);
  });

  it('displays pre-existing labels for a collection', () => {
    // Let's assign the two mock labels that we have to a collection
    collection.labels = labels;

    render(
      <CollectionForm
        authors={authors}
        collection={collection}
        curationCategories={curationCategories}
        iabCategories={iabCategories}
        labels={labels}
        languages={languages}
        onSubmit={handleSubmit}
      />,
    );

    // Expect to see both of these labels on the screen
    expect(screen.getByText(labels[0].name)).toBeInTheDocument();
    expect(screen.getByText(labels[1].name)).toBeInTheDocument();
  });
});
