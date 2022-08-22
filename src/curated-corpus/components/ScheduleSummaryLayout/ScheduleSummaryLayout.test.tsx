import React from 'react';
import { ScheduleSummaryLayout } from './ScheduleSummaryLayout';
import { render, screen, within } from '@testing-library/react';
import { scheduledItems } from '../../integration-test-mocks/getScheduledItems';
import { getDisplayTopic } from '../../helpers/topics';
import { Topics } from '../../../api/generatedTypes';

/**
 * Much of the functionality used by this component is already unit-tested in
 * - ScheduleSummaryCard
 * - ScheduleSummaryConnector
 * - helper functions
 *
 * But let's still dive in and make sure it can stand on its own!
 */
describe('The ScheduleSummaryLayout component', () => {
  it('should display summarised data', () => {
    render(<ScheduleSummaryLayout scheduledItems={scheduledItems} />);

    // Let's get both tables we're displaying in this component
    const tables = screen.getAllByRole('table');
    const publishers = tables[0];
    const topics = tables[1];

    // The three scheduled items have two publishers
    expect(
      within(publishers).getByText(/amazing inventions/i)
    ).toBeInTheDocument();
    expect(within(publishers).getByText('2')).toBeInTheDocument();

    expect(
      within(publishers).getByText(/fantastic computers/i)
    ).toBeInTheDocument();
    expect(within(publishers).getByText('1')).toBeInTheDocument();

    // And there are three topics present
    expect(
      within(topics).getByText(getDisplayTopic(Topics.Politics))
    ).toBeInTheDocument();
    expect(
      within(topics).getByText(getDisplayTopic(Topics.PersonalFinance))
    ).toBeInTheDocument();
    expect(
      within(topics).getByText(getDisplayTopic(Topics.HealthFitness))
    ).toBeInTheDocument();

    // And all of these show a total of one for each topic.
    expect(within(topics).getAllByText(1)).toHaveLength(3);
  });

  it('should not fall over if given empty dataset', () => {
    render(<ScheduleSummaryLayout scheduledItems={[]} />);

    expect(screen.getByText('Publishers')).toBeInTheDocument();
    expect(screen.getByText('Topics')).toBeInTheDocument();
  });
});
