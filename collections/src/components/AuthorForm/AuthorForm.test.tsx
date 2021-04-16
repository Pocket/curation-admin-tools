import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthorForm } from './AuthorForm';
import { AuthorModel } from '../../api';

describe('The AuthorForm component', () => {
  let author: AuthorModel;

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
      createdAt: '2021-03-21T02:18:07.473Z',
      updatedAt: null,
      Collections: [{ externalId: '123abc' }],
    };
  });

  it('renders successfully', () => {
    render(<AuthorForm author={author} />);

    // there is at least a form and nothing falls over
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('shows three action buttons by default', () => {
    render(<AuthorForm author={author} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toEqual(3);
  });

  it('only shows two buttons if cancel button is not requested', () => {
    render(<AuthorForm author={author} showCancelButton={false} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toEqual(2);
  });

  it('displays author information', () => {
    render(<AuthorForm author={author} />);

    const nameField = screen.getByLabelText('Full name');
    expect(nameField).toBeInTheDocument();

    const slugField = screen.getByLabelText('Slug');
    expect(slugField).toBeInTheDocument();

    const bioField = screen.getByLabelText('Bio');
    expect(bioField).toBeInTheDocument();

    const activeField = screen.getByLabelText('Active');
    expect(activeField).toBeInTheDocument();
  });
});
