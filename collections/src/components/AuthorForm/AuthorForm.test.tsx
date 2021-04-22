import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthorForm } from './AuthorForm';
import { AuthorModel } from '../../api';

describe('The AuthorForm component', () => {
  let author: AuthorModel;
  let handleSubmit = jest.fn();

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
      <AuthorForm
        author={author}
        showCancelButton={false}
        onSubmit={handleSubmit}
      />
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
      screen.queryByText(/please enter the full name of the author/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/name must be at least 6 characters/i)
    ).not.toBeInTheDocument();

    // Submit a name that is too short (under 6 characters)
    // Note that a full name is expected here - few first name + last name combinations
    // are shorter than this.
    userEvent.type(nameField, 'John');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter the full name of the author/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/name must be at least 6 characters/i)
    ).toBeInTheDocument();

    // Submit a name that satisfies all the requirements
    userEvent.type(nameField, 'John Citizen');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter the full name of the author/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/name must be at least 6 characters/i)
    ).not.toBeInTheDocument();
  });

  it('validates the "slug" field', () => {
    //
  });

  it('validates the "bio" field', () => {
    //
  });

  it('suggests the slug correctly', () => {
    //
  });
});
