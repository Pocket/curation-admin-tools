import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProspectPublisherFilter } from './ProspectPublisherFilter';

describe('The ProspectPublisherFilter component', () => {
  let excludePublisherSwitch = true;
  const filterByPublisher = '';
  const setFilterByPublisher = jest.fn();
  const onChange = jest.fn();
  const onSortByPublishedDate = jest.fn();
  const sortByPublishedDate = false;
  const sortByTimeToRead = false;
  const handleSortByTimeToRead = jest.fn();

  const renderComponent = () => {
    render(
      <ProspectPublisherFilter
        excludePublisherSwitch={excludePublisherSwitch}
        filterByPublisher={filterByPublisher}
        setFilterByPublisher={setFilterByPublisher}
        onChange={onChange}
        onSortByPublishedDate={onSortByPublishedDate}
        sortByPublishedDate={sortByPublishedDate}
        sortByTimeToRead={sortByTimeToRead}
        handleSortByTimeToRead={handleSortByTimeToRead}
      />,
    );
  };

  it('renders the "exclude" label correctly', () => {
    renderComponent();

    // The default switch label is present
    const switchLabel = screen.getByText(/exclude/i);
    expect(switchLabel).toBeInTheDocument();

    // the text field is present
    const filterByField = screen.getByLabelText(/filter by publisher/i);
    expect(filterByField).toBeInTheDocument();
  });

  it('renders the "include" label correctly', () => {
    excludePublisherSwitch = false;

    renderComponent();

    // The "include" switch label is present
    const switchLabel = screen.getByText(/include/i);
    expect(switchLabel).toBeInTheDocument();
  });

  it('should render the sort by published date filter', () => {
    renderComponent();

    const publishedDate = screen.getByText(/Published Date/i);
    expect(publishedDate).toBeInTheDocument();
  });

  it('should render the sort by time to read filter', () => {
    renderComponent();

    const timeToRead = screen.getByText(/Time to Read/i);
    expect(timeToRead).toBeInTheDocument();
  });
});
