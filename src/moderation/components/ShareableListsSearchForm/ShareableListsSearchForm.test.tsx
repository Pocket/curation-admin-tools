import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/material/styles';

import theme from '../../../theme';
import { ShareableListsSearchForm } from './ShareableListsSearchForm';
import userEvent from '@testing-library/user-event';

describe('The ShareableListsSearchForm component', () => {
  const onSubmit = jest.fn();

  it('should render all the form fields with correct initial values', () => {
    render(
      <MockedProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <ShareableListsSearchForm onSubmit={onSubmit} />
          </SnackbarProvider>
        </ThemeProvider>
      </MockedProvider>
    );

    const id = screen.getByLabelText(/List ID/);
    expect(id).toBeInTheDocument();
  });

  it('should render form buttons', () => {
    render(
      <MockedProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <ShareableListsSearchForm onSubmit={onSubmit} />
          </SnackbarProvider>
        </ThemeProvider>
      </MockedProvider>
    );

    const searchButton = screen.getByText(/Search/);

    // Just the single "Search" button on this form
    expect(searchButton).toBeInTheDocument();
  });

  it('should execute the callback on submit', async () => {
    render(
      <MockedProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <ShareableListsSearchForm onSubmit={onSubmit} />
          </SnackbarProvider>
        </ThemeProvider>
      </MockedProvider>
    );

    const id = screen.getByLabelText(/List ID/);
    userEvent.type(id, '12345-qwerty');

    const button = screen.getByRole('button', {
      name: /Search/i,
    });
    await waitFor(() => {
      userEvent.click(button);
    });
    expect(onSubmit).toHaveBeenCalled();
  });
});
