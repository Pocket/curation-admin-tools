import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { ScheduleSummaryConnector } from './ScheduleSummaryConnector';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  mock_scheduledItems,
  mock_scheduledItemsNoResults,
} from '../../integration-test-mocks/getScheduledItems';
import { getDisplayTopic } from '../../helpers/topics';
import { Topics } from '../../../api/generatedTypes';

describe('The ScheduleSummaryConnector component', () => {
  let mocks: MockedResponse[] = [];

  beforeEach(() => {
    mocks = [mock_scheduledItems];
  });

  it('shows summary headings - including syndicated %, etc.', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <ScheduleSummaryConnector
          date={'2023-01-01'}
          scheduledSurfaceGuid={'NEW_TAB_EN_US'}
          refreshData={false}
          setRefreshData={jest.fn()}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      // Shows correct heading with formatted display date
      expect(
        // Regex because this phrase takes up two lines in the DOM
        // with extra whitespace/line break
        screen.getByText(/scheduled for[\s\n]+?january 1, 2023/i)
      ).toBeInTheDocument();

      // Shows syndicated/total scheduled split ("0/3 Syndicated").
      expect(screen.getByText(/1[\s\n]+?syndicated/i)).toBeInTheDocument();
    });
  });

  it('shows topic summary', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <ScheduleSummaryConnector
          date={'2023-01-01'}
          scheduledSurfaceGuid={'NEW_TAB_EN_US'}
          refreshData={false}
          setRefreshData={jest.fn()}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      // Let's get both tables we're displaying in this component
      const tables = screen.getAllByRole('table');

      // Current mocks (three scheduled items) have three different topics
      // display names are used for those - mocks have topic codes.
      //
      // Let's also limit the DOM search to the topic table
      // (the second one in the component).
      expect(
        within(tables[1]).getByText(getDisplayTopic(Topics.Politics))
      ).toBeInTheDocument();
      expect(
        within(tables[1]).getByText(getDisplayTopic(Topics.PersonalFinance))
      ).toBeInTheDocument();
      expect(
        within(tables[1]).getByText(getDisplayTopic(Topics.HealthFitness))
      ).toBeInTheDocument();

      // And all of these show a total of one for each topic.
      expect(within(tables[1]).getAllByText(1)).toHaveLength(3);
    });
  });

  it('shows publisher summary', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <ScheduleSummaryConnector
          date={'2023-01-01'}
          scheduledSurfaceGuid={'NEW_TAB_EN_US'}
          refreshData={false}
          setRefreshData={jest.fn()}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      // Let's get both tables we're displaying in this component
      const tables = screen.getAllByRole('table');

      // Current mocks (three scheduled items) have two publishers
      expect(
        within(tables[0]).getByText(/amazing inventions/i)
      ).toBeInTheDocument();
      expect(within(tables[0]).getByText('2')).toBeInTheDocument();

      expect(
        within(tables[0]).getByText(/fantastic computers/i)
      ).toBeInTheDocument();
      expect(within(tables[0]).getByText('1')).toBeInTheDocument();
    });
  });

  it('handles empty state', async () => {
    mocks = [mock_scheduledItemsNoResults];

    render(
      <MockedProvider mocks={mocks}>
        <ScheduleSummaryConnector
          date={'2023-01-01'}
          scheduledSurfaceGuid={'NEW_TAB_EN_US'}
          refreshData={false}
          setRefreshData={jest.fn()}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/no results/i)).toBeInTheDocument();
    });
  });
});
