import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ApprovedItemSearchForm } from './ApprovedItemSearchForm';

describe('The CuratedItemSearchForm component', () => {
  const handleSubmit = jest.fn();

  it('renders successfully', () => {
    render(<ApprovedItemSearchForm onSubmit={handleSubmit} />);

    // there is at least a form and nothing falls over
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('has a "Search" button', () => {
    render(<ApprovedItemSearchForm onSubmit={handleSubmit} />);

    const button = screen.getByRole('button', {
      name: /search/i,
    });
    expect(button).toBeInTheDocument();
  });

  it('has a "Reset Filters" button', () => {
    render(<ApprovedItemSearchForm onSubmit={handleSubmit} />);

    const button = screen.getByRole('button', {
      name: /reset filters/i,
    });
    expect(button).toBeInTheDocument();
  });

  it('has all the expected fields', () => {
    render(<ApprovedItemSearchForm onSubmit={handleSubmit} />);

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
    render(<ApprovedItemSearchForm onSubmit={handleSubmit} />);

    const searchButton = screen.getByRole('button', {
      name: /search/i,
    });

    // All filters are optional, so the form should submit without anything in it.
    await waitFor(() => {
      userEvent.click(searchButton);
    });
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('validates the partial match fields', async () => {
    render(<ApprovedItemSearchForm onSubmit={handleSubmit} />);

    const titleField = screen.getByLabelText(/filter by title/i);
    const urlField = screen.getByLabelText(/filter by url/i);
    const searchButton = screen.getByRole('button', {
      name: /search/i,
    });

    // When filtering by title, we expect the user to provide at least two characters.
    userEvent.type(titleField, '1');
    await waitFor(() => {
      userEvent.click(searchButton);
    });
    expect(
      screen.getByText('Please enter at least two characters.')
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();

    userEvent.clear(titleField);

    // We have the same expectations for the URL filter
    userEvent.type(urlField, 'a');
    await waitFor(() => {
      userEvent.click(searchButton);
    });

    expect(
      screen.getByText('Please enter at least two characters.')
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();

    // Let's try again with a longer filter value
    userEvent.clear(urlField);
    userEvent.type(urlField, 'abc');
    await waitFor(() => {
      userEvent.click(searchButton);
    });

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('resets all form filters when Reset Filters button is clicked', async () => {
    render(<ApprovedItemSearchForm onSubmit={handleSubmit} />);

    // get all the search from input fields
    const titleField = screen.getByLabelText(/filter by title/i);
    const urlField = screen.getByLabelText(/filter by url/i);
    const topicField = screen.getByLabelText(/topic/i);
    const languageField = screen.getByLabelText(/language/i);

    // get the reset filters button
    const resetButton = screen.getByRole('button', {
      name: /reset filters/i,
    });

    // type something in the text fields
    userEvent.type(titleField, 'test title');
    userEvent.type(urlField, 'test url');
    userEvent.selectOptions(topicField, 'BUSINESS');
    userEvent.selectOptions(languageField, 'EN');

    // reset the filters by clicking on the reset filters button
    await waitFor(() => {
      userEvent.click(resetButton);
    });

    // assert that the filters have been reset
    expect(titleField).toHaveValue('');
    expect(urlField).toHaveValue('');
    expect(topicField).toHaveValue('');
    expect(languageField).toHaveValue('');
  });
});
