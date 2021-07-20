import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PartnerForm } from './PartnerForm';
import { CollectionPartner } from '../../api/collection-api/generatedTypes';

describe('The PartnerForm component', () => {
  let partner: CollectionPartner;
  let handleSubmit = jest.fn();

  beforeEach(() => {
    partner = {
      externalId: '123-abc',
      name: 'Configuration Captivation',
      url: 'https://configuration-captivation.io',
      imageUrl: 'http://placeimg.com/640/480/tech',
      blurb:
        'Incidunt corrupti earum. Quasi aut qui magnam eum. ' +
        'Quia non dolores voluptatem est aut. Id officiis nulla est.\n \r' +
        'Harum et velit debitis. Quia assumenda commodi et dolor. ' +
        'Ut dicta veritatis perspiciatis suscipit. ' +
        'Aspernatur reprehenderit laboriosam voluptates ut. Ut minus aut est.',
    };
  });

  it('renders successfully', () => {
    render(<PartnerForm partner={partner} onSubmit={handleSubmit} />);

    // there is at least a form and nothing falls over
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('shows three action buttons by default', () => {
    render(<PartnerForm partner={partner} onSubmit={handleSubmit} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toEqual(2);
  });

  it('only shows one button if cancel button is not requested', () => {
    render(
      <PartnerForm partner={partner} editMode={false} onSubmit={handleSubmit} />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toEqual(1);
  });

  it('displays partner information', () => {
    render(<PartnerForm partner={partner} onSubmit={handleSubmit} />);

    const nameField = screen.getByLabelText('Name');
    expect(nameField).toBeInTheDocument();

    const urlField = screen.getByLabelText('URL');
    expect(urlField).toBeInTheDocument();

    const blurbField = screen.getByLabelText('Blurb');
    expect(blurbField).toBeInTheDocument();
  });

  it('validates the "name" field', async () => {
    render(<PartnerForm partner={partner} onSubmit={handleSubmit} />);

    const nameField = screen.getByLabelText(/name/i);
    const saveButton = screen.getByText(/save/i);

    // Submit an empty field
    userEvent.clear(nameField);
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter the name of the partner company/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/please enter at least two characters/i)
    ).not.toBeInTheDocument();

    // Submit a name that is too short (under two characters)
    userEvent.type(nameField, 'B');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter the name of the partner company/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/please enter at least two characters/i)
    ).toBeInTheDocument();

    // Submit a name that satisfies all the requirements
    userEvent.type(nameField, 'Construction Contraption');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter the name of the partner company/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/please enter at least two characters/i)
    ).not.toBeInTheDocument();
  });

  it('validates the URL field', async () => {
    render(<PartnerForm partner={partner} onSubmit={handleSubmit} />);

    const urlField = screen.getByLabelText(/url/i);
    const saveButton = screen.getByText(/save/i);

    // Submit an empty field
    userEvent.clear(urlField);
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(screen.queryByText(/please enter a url/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/url must be at least 12 characters long/i)
    ).not.toBeInTheDocument();

    // Submit a URL that is too short (under 12 characters)
    userEvent.type(urlField, 'http://');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(screen.queryByText(/please enter a url/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/url must be at least 12 characters long/i)
    ).toBeInTheDocument();

    // Submit a URL that satisfies all the requirements
    userEvent.type(urlField, 'http://construction-contraption.com');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(screen.queryByText(/please enter a url/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/url must be at least 12 characters long/i)
    ).not.toBeInTheDocument();
  });

  it('requires the blurb field', async () => {
    render(<PartnerForm partner={partner} onSubmit={handleSubmit} />);

    const blurbField = screen.getByLabelText(/blurb/i);
    const saveButton = screen.getByText(/save/i);

    // Submit an empty field
    userEvent.clear(blurbField);
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter the blurb for the partner company/i)
    ).toBeInTheDocument();

    // Submit some text
    userEvent.type(blurbField, 'Lorem ipsum');
    await waitFor(() => {
      userEvent.click(saveButton);
    });
    expect(
      screen.queryByText(/please enter the blurb for the partner company/i)
    ).not.toBeInTheDocument();
  });

  it('has markdown preview tabs', () => {
    render(<PartnerForm partner={partner} onSubmit={handleSubmit} />);

    expect(screen.getByText(/write/i)).toBeInTheDocument();
    expect(screen.getByText(/preview/i)).toBeInTheDocument();
  });
});
