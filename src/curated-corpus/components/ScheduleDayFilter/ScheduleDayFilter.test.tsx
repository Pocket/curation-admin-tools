import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme';
import { ScheduleDayFilter } from '..';
import { Maybe } from '../../../api/generatedTypes';
import { getDisplayTopic, getGroupedTopicData } from '../../helpers/topics';
import { scheduledItems } from '../../integration-test-mocks/getScheduledItems';

describe('The ScheduleDayFilter component', () => {
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
          <ScheduleDayFilter
            filterData={topicList}
            filterName={'Topics'}
            itemCount={60}
            setFilters={jest.fn()}
          />
        </ThemeProvider>
      </MemoryRouter>,
    );

    // This is the name of the filter: it is visible on the page
    const button = screen.getByText(/Topics/i);
    expect(button).toBeInTheDocument();

    // Let's open up the dropdown
    userEvent.click(button);

    // Check that each topic displayed has a name
    topicList.forEach((topic) => {
      const menuOption = screen.getByText(new RegExp(topic.name, 'i'));
      expect(menuOption).toBeInTheDocument();

      // If there are no stories for a given topic, this menu option
      // should be disabled.
      if (topic.count === 0) {
        expect(menuOption).toHaveAttribute('aria-disabled');
      } else {
        expect(menuOption).not.toHaveAttribute('aria-disabled');
      }
    });
  });

  it('should call the "setFilters" function when a menu option is chosen', () => {
    const setFilters = jest.fn();
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <ScheduleDayFilter
            filterData={topicList}
            filterName={'Topics'}
            itemCount={60}
            setFilters={setFilters}
          />
        </ThemeProvider>
      </MemoryRouter>,
    );

    // Let's open up the dropdown
    userEvent.click(screen.getByText(/Topics/i));

    // And click on a topic
    userEvent.click(screen.getByText(/Personal Finance/i));

    expect(setFilters).toHaveBeenCalled();
  });
});
