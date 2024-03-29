import React from 'react';
import { ScheduleSummaryCard } from './ScheduleSummaryCard';
import { render, screen } from '@testing-library/react';

describe('The ScheduleSummaryCard component', () => {
  it('should show a schedule summary', () => {
    const items = [
      { name: 'Publisher One', count: 4 },
      { name: 'Publisher 2', count: 3 },
      { name: 'Another publisher', count: 2 },
      { name: 'Final publisher', count: 1 },
    ];
    render(<ScheduleSummaryCard headingCopy={'Publishers'} items={items} />);

    // There should be a heading
    expect(screen.getByText('Publishers')).toBeInTheDocument();

    // And all the rows with publisher names and data
    items.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(item.count)).toBeInTheDocument();
    });
  });

  it('should not show count for zero-count entries', () => {
    const items = [
      { name: 'Publisher One', count: 2 },
      { name: 'Publisher 2', count: 1 },
      { name: 'Another publisher', count: 0 },
    ];
    render(<ScheduleSummaryCard headingCopy={'Publishers'} items={items} />);

    // Let's check the last row of the table.
    // There should be the name of the entry, but not the zero
    expect(screen.getByText(items[2].name)).toBeInTheDocument();
    expect(screen.queryByText(items[2].count)).not.toBeInTheDocument();
  });
});
