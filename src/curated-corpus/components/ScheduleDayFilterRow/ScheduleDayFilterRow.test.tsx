import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme';
import { ScheduleDayFilterRow } from '..';

import { scheduledItems } from '../../integration-test-mocks/getScheduledItems';

describe('The ScheduleDayFilterRow component', () => {
  it('should render the component', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <ScheduleDayFilterRow
            scheduledItems={scheduledItems}
            setFilters={jest.fn()}
          />
        </ThemeProvider>
      </MemoryRouter>,
    );

    // Make sure all three filters are present on the page
    expect(screen.getByText(/Topics/i)).toBeInTheDocument();
    expect(screen.getByText(/Types/i)).toBeInTheDocument();
    expect(screen.getByText(/Publishers/i)).toBeInTheDocument();
  });
});
