import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthorForm } from './AuthorForm';
import { CollectionAuthor } from '../../../api/generatedTypes';

describe('The AuthorForm component', () => {
  let author: CollectionAuthor;
  const handleSubmit = jest.fn();

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

  it('renders successfully', () => {
    render(<AuthorForm author={author} onSubmit={handleSubmit} />);

    // there is at least a form and nothing falls over
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('shows three action buttons by default', () => {
    render(<AuthorForm author={author} onSubmit={handleSubmit} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toEqual(3);
  });

  it('only shows two buttons if cancel button is not requested', () => {
    render(
      <AuthorForm author={author} editMode={false} onSubmit={handleSubmit} />,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toEqual(2);
  });

  it('displays author information', () => {
    render(<AuthorForm author={author} onSubmit={handleSubmit} />);

    const nameField = screen.getByLabelText('Full name');
    expect(nameField).toBeInTheDocument();

    const slugField = screen.getByLabelText('Slug');
    expect(slugField).toBeInTheDocument();

    const bioField = screen.getByLabelText('Bio');
    expect(bioField).toBeInTheDocument();

    const activeField = screen.getByLabelText('Active');
    expect(activeField).toBeInTheDocument();
  });

  it('validates the "name" field', async () => {
    render(<AuthorForm author={author} onSubmit={handleSubmit} />);

    const nameField = screen.getByLabelText(/full name/i);
    const saveButton = screen.getByText(/save/i);

    // Submit an empty field
    userEvent.clear(nameField);
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter the full name of the author/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/name must be at least 2 characters/i),
    ).not.toBeInTheDocument();

    // Submit a name that is too short (under 2 characters)
    // Note that a full name is expected here - few first name + last name combinations
    // are shorter than this.
    // **NOTE** As of November 28, 2022. We changed the minimum author name requirement to 2 as per curators' request.
    userEvent.type(nameField, 'J');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter the full name of the author/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/name must be at least 2 characters/i),
    ).toBeInTheDocument();

    // Submit a name that satisfies all the requirements
    userEvent.type(nameField, 'John Citizen');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter the full name of the author/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/name must be at least 2 characters/i),
    ).not.toBeInTheDocument();
  });

  it('validates the "slug" field', async () => {
    render(<AuthorForm author={author} onSubmit={handleSubmit} />);

    const slugField = screen.getByLabelText(/slug/i);
    const saveButton = screen.getByText(/save/i);

    // Submit an empty field
    userEvent.clear(slugField);
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(screen.queryByText(/please enter a slug/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/slug must be at least 2 characters/i),
    ).not.toBeInTheDocument();

    // Submit a slug that is too short (under 2 characters)
    // **NOTE** As of November 28, 2022. We changed the minimum author name requirement to 2 as per curators' request. This affects the slug length as well.
    userEvent.type(slugField, 'q');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(screen.queryByText(/please enter a slug/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/slug must be at least 2 characters/i),
    ).toBeInTheDocument();

    // Submit a slug that satisfies all the requirements
    userEvent.type(slugField, 'queen-bee');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(screen.queryByText(/please enter a slug/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/slug must be at least 2 characters/i),
    ).not.toBeInTheDocument();
  });

  it('suggests the slug correctly', async () => {
    render(<AuthorForm author={author} onSubmit={handleSubmit} />);

    // The "Suggest slug" button slugifies whatever is present in the "Full name" field
    const slugField = screen.getByLabelText(/slug/i);
    const nameField = screen.getByLabelText(/name/i);
    const suggestSlugButton = screen.getByText(/suggest slug/i);

    // Try with an empty field first
    userEvent.clear(slugField);
    userEvent.clear(nameField);

    await waitFor(() => {
      userEvent.click(suggestSlugButton);
    });

    // Slugify button returned an empty string
    expect(slugField).toHaveTextContent('');

    // Try with an actual name
    userEvent.type(nameField, 'John Citizen');

    await waitFor(() => {
      userEvent.click(suggestSlugButton);
    });

    // Slugified version of the name appears in the slug input field
    expect(screen.getByDisplayValue('john-citizen')).toBeInTheDocument();
  });

  it('displays the "active" status correctly', async () => {
    render(<AuthorForm author={author} onSubmit={handleSubmit} />);

    // By default the mock author set up before each test is active
    const checkbox = screen.getByLabelText(/active/i);
    expect(checkbox).toBeInTheDocument();

    // Let's uncheck it
    await waitFor(() => {
      userEvent.click(checkbox);
    });

    // Checkbox now displays "Inactive" as its label
    expect(screen.queryByLabelText(/inactive/i)).toBeInTheDocument();
  });

  it('has markdown preview tabs', () => {
    render(<AuthorForm author={author} onSubmit={handleSubmit} />);

    expect(screen.getByText(/write/i)).toBeInTheDocument();
    expect(screen.getByText(/preview/i)).toBeInTheDocument();
  });
});
