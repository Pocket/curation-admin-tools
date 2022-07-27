import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ScheduleSummaryConnector } from './ScheduleSummaryConnector';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { mock_scheduledItems } from '../../integration-test-mocks/getScheduledItems';

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
        />
      </MockedProvider>
    );

    // Shows correct heading with formatted display date
    await waitFor(() => {
      expect(
        screen.findByText('Scheduled for January 1, 2023')
      ).toBeInTheDocument();
    });

    // Shows syndicated/total scheduled split
  });

  it.todo('shows topic summary');

  it.todo('shows publisher summary');

  it.todo('handles empty state');
});
