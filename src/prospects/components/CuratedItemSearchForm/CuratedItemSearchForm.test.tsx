import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { CuratedItemSearchForm } from './CuratedItemSearchForm';
import userEvent from '@testing-library/user-event';

describe('The CuratedItemSearchForm component', () => {
  const handleSubmit = jest.fn();

  it('renders successfully', () => {
    render(<CuratedItemSearchForm onSubmit={handleSubmit} />);

    // there is at least a form and nothing falls over
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('has a single "Search" button', () => {
    render(<CuratedItemSearchForm onSubmit={handleSubmit} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('has all the expected fields', () => {
    render(<CuratedItemSearchForm onSubmit={handleSubmit} />);

    const titleField = screen.getByLabelText(/filter by title/i);
    expect(titleField).toBeInTheDocument();

    const urlField = screen.getByLabelText(/filter by url/i);
    expect(urlField).toBeInTheDocument();

    const statusField = screen.getByLabelText(/status/i);
    expect(statusField).toBeInTheDocument();

    const topicField = screen.getByLabelText(/topic/i);
    expect(topicField).toBeInTheDocument();

    const languageField = screen.getByLabelText(/language/i);
    expect(languageField).toBeInTheDocument();
  });

  it('allows users to search without any filters', async () => {
    render(<CuratedItemSearchForm onSubmit={handleSubmit} />);

    const button = screen.getByRole('button');

    // All filters are optional, so the form should submit without anything in it.
    await waitFor(() => {
      userEvent.click(button);
    });
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('validates the partial match fields', async () => {
    render(<CuratedItemSearchForm onSubmit={handleSubmit} />);

    const titleField = screen.getByLabelText(/filter by title/i);
    const urlField = screen.getByLabelText(/filter by url/i);
    const button = screen.getByRole('button');

    // When filtering by title, we expect the user to provide at least two characters.
    userEvent.type(titleField, '1');
    await waitFor(() => {
      userEvent.click(button);
    });
    expect(
      screen.getByText('Please enter at least two characters.')
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();

    userEvent.clear(titleField);

    // We have the same expectations for the URL filter
    userEvent.type(urlField, 'a');
    await waitFor(() => {
      userEvent.click(button);
    });

    expect(
      screen.getByText('Please enter at least two characters.')
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();

    // Let's try again with a longer filter value
    userEvent.clear(urlField);
    userEvent.type(urlField, 'abc');
    await waitFor(() => {
      userEvent.click(button);
    });

    expect(handleSubmit).toHaveBeenCalled();
  });
});
