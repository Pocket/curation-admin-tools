import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProspectFilters } from './ProspectFilters';
import { CorpusLanguage, Prospect, Topics } from '../../../api/generatedTypes';
import { ScheduleSummary } from '../ScheduleSummaryCard/ScheduleSummaryCard';

describe('The ProspectFilters component', () => {
  const prospects: Prospect[] = [
    {
      id: '123-abc',
      prospectId: '456-dfg',
      title: 'How To Win Friends And Influence People with DynamoDB',
      scheduledSurfaceGuid: 'NEW_TAB_EN_US',
      prospectType: 'organic-timespent',
      url: 'http://www.test.com/how-to',
      imageUrl: 'https://placeimg.com/640/480/people?random=495',
      excerpt:
        'Everything You Wanted to Know About DynamoDB and Were Afraid To Ask',
      language: CorpusLanguage.En,
      publisher: 'Amazing Inventions',
      authors: 'Charles Dickens,O. Henry',
      topic: Topics.Technology,
      saveCount: 111222,
      isSyndicated: false,
    },
    {
      id: '456-def',
      prospectId: '123-bc',
      title:
        'How We Discovered That People Who Are Colorblind Are Less Likely to Be Picky Eaters',
      scheduledSurfaceGuid: 'NEW_TAB_EN_US',
      prospectType: 'organic-timespent',
      url: 'http://www.test.com/how-to',
      imageUrl: 'https://placeimg.com/640/480/people?random=495',
      excerpt:
        'The seventh season of Julia Child’s “The French Chef,” the first of the television series to ' +
        'air in color, revealed how color can change the experience of food.',
      language: CorpusLanguage.En,
      publisher: 'The Conversation',
      authors: 'Jason Parham',
      topic: Topics.Food,
      saveCount: 111222,
      isSyndicated: false,
    },
  ];
  let excludePublisherSwitch = true;
  const filterByPublisher = '';
  const setFilterByPublisher = jest.fn();
  const onChange = jest.fn();
  const onSortByPublishedDate = jest.fn();
  const sortByPublishedDate = false;
  const sortByTimeToRead = false;
  const handleSortByTimeToRead = jest.fn();

  const mockSetFilters = jest.fn();

  const filterData: ScheduleSummary[] = [
    { name: 'Topic 1', count: 10 },
    { name: 'Topic 2', count: 20 },
    { name: 'Topic 3', count: 0 },
  ];
  const renderComponent = () => {
    render(
      <ProspectFilters
        setProspectMetadataFilters={jest.fn()}
        prospects={prospects}
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

  it('should render the topic filter', () => {
    renderComponent();

    const topicFilter = screen.getByText(/Filter by Topic/i);
    expect(topicFilter).toBeInTheDocument();
  });
});
