import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme';
import { DropDownFilter } from '..';
import { Maybe } from '../../../api/generatedTypes';
import { getDisplayTopic, getGroupedTopicData } from '../../helpers/topics';
import { scheduledItems } from '../../integration-test-mocks/getScheduledItems';

describe('The DropDownFilter component', () => {
  // Extract all topics from scheduled item data
  const topics =
    scheduledItems.map(
      (item: { approvedItem: { topic: Maybe<string> | undefined } }) =>
        getDisplayTopic(item.approvedItem.topic),
    ) ?? [];

  const topicList = getGroupedTopicData(topics, true, false);

  it('should render the component', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <DropDownFilter
            filterData={topicList}
            filterName={'Topics'}
            itemCount={60}
            setScheduleFilters={jest.fn()}
            setProspectFilters={jest.fn()}
          />
        </ThemeProvider>
      </MemoryRouter>,
    );

    // Check for the button text
    const button = screen.getByText(/All/i);
    expect(button).toBeInTheDocument();

    // Open the dropdown
    userEvent.click(button);

    // Verify topic menu items
    topicList.forEach((topic) => {
      const menuOption = screen.getByText(new RegExp(topic.name, 'i'));
      expect(menuOption).toBeInTheDocument();

      // Check if the topic option is disabled if no stories for topic found
      if (topic.count === 0) {
        expect(menuOption).toHaveAttribute('aria-disabled');
      } else {
        expect(menuOption).not.toHaveAttribute('aria-disabled');
      }
    });
  });
  it('should call the "setFilters" function', async () => {
    const setFilters = jest.fn();
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <DropDownFilter
            filterData={topicList}
            filterName={'Topics'}
            itemCount={60}
            setScheduleFilters={setFilters}
            setProspectFilters={setFilters}
          />
        </ThemeProvider>
      </MemoryRouter>,
    );

    const button = screen.getByText(/All/i);
    expect(button).toBeInTheDocument();

    // Open the dropdown
    userEvent.click(button);

    // Check each topic option for its state and click if enabled
    topicList.forEach((topic) => {
      const menuOption = screen.getByText(new RegExp(topic.name, 'i'));
      if (!menuOption.closest('li')?.hasAttribute('aria-disabled')) {
        userEvent.click(menuOption);
        expect(setFilters).toHaveBeenCalled();
      }
    });
  });
});
