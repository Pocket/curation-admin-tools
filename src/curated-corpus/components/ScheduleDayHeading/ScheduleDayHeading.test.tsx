import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme';
import { ScheduleDayHeading } from '..';

import { scheduledItems } from '../../integration-test-mocks/getScheduledItems';
import { ScheduledCorpusItemsResult } from '../../../api/generatedTypes';

describe('The ScheduleDayHeading component', () => {
  const data: ScheduledCorpusItemsResult = {
    scheduledDate: '2024-06-20',
    collectionCount: 3,
    syndicatedCount: 15,
    totalCount: 60,
    items: scheduledItems,
  };

  it('should render the component', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <ScheduleDayHeading
            data={data}
            setFilters={jest.fn()}
            onAddItem={jest.fn()}
          />
        </ThemeProvider>
      </MemoryRouter>,
    );

    // Shows syndicated/total scheduled split
    expect(screen.getByText(/15\/60 syndicated/i)).toBeInTheDocument();

    // Shows the filters
    expect(screen.getByText(/Topics/i)).toBeInTheDocument();
    expect(screen.getByText(/Types/i)).toBeInTheDocument();
    expect(screen.getByText(/Publishers/i)).toBeInTheDocument();

    // Shows the "Add item" button
    expect(screen.getByText(/Add item/i)).toBeInTheDocument();
  });

  it('executes a callback on pressing the "Add item" button', () => {
    const onAddItem = jest.fn();

    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <ScheduleDayHeading
            data={data}
            setFilters={jest.fn()}
            onAddItem={onAddItem}
          />
        </ThemeProvider>
      </MemoryRouter>,
    );

    const addItemButton = screen.getByText(/Add item/i);

    userEvent.click(addItemButton);

    expect(onAddItem).toHaveBeenCalled();
  });
});
