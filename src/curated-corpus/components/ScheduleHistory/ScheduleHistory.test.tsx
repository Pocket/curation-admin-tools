import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ScheduleHistory } from './ScheduleHistory';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme';

describe('The ScheduleHistory component', () => {
  it('should render the buttons to toggle and hide recent scheduled runs', async () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <ScheduleHistory data={[]} />
        </ThemeProvider>
      </MemoryRouter>
    );

    // the button when clicked shows us the recent scheduled runs
    const recentScheduledRunsButton = screen.getByRole('button', {
      name: /view recently scheduled/i,
    });

    expect(recentScheduledRunsButton).toBeInTheDocument();

    // click the button and wait for the UI updates
    await waitFor(() => {
      userEvent.click(recentScheduledRunsButton);
    });

    // fetch the same button with a different name now since it was clicked
    const hideScheduledRunsButton = screen.getByRole('button', {
      name: /hide recently scheduled/i,
    });

    expect(hideScheduledRunsButton).toBeInTheDocument();

    // click the hide button and wait for the UI updates
    await waitFor(() => {
      userEvent.click(hideScheduledRunsButton);
    });

    // the original copy is displayed again
    expect(recentScheduledRunsButton).toBeInTheDocument();
  });
});
