import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProspectPublisherFilter } from './ProspectPublisherFilter';

describe('The ProspectPublisherFilter component', () => {
  let excludePublisherSwitch = true;
  const filterByPublisher = '';
  const setFilterByPublisher = jest.fn();
  const onChange = jest.fn();

  it('renders the "exclude" label correctly', () => {
    render(
      <ProspectPublisherFilter
        excludePublisherSwitch={excludePublisherSwitch}
        filterByPublisher={filterByPublisher}
        setFilterByPublisher={setFilterByPublisher}
        onChange={onChange}
      />
    );

    // The default switch label is present
    const switchLabel = screen.getByText(/exclude/i);
    expect(switchLabel).toBeInTheDocument();

    // the text field is present
    const filterByField = screen.getByLabelText(/filter by publisher/i);
    expect(filterByField).toBeInTheDocument();
  });

  it('renders the "include" label correctly', () => {
    excludePublisherSwitch = false;

    render(
      <ProspectPublisherFilter
        excludePublisherSwitch={excludePublisherSwitch}
        filterByPublisher={filterByPublisher}
        setFilterByPublisher={setFilterByPublisher}
        onChange={onChange}
      />
    );

    // The "include" switch label is present
    const switchLabel = screen.getByText(/include/i);
    expect(switchLabel).toBeInTheDocument();
  });
});
