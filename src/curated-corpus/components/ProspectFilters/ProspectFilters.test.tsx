import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProspectFilters } from './ProspectFilters';
import {
  CorpusItemSource,
  CorpusLanguage,
  CuratedStatus,
  Prospect,
  Topics,
} from '../../../api/generatedTypes';
import { StoriesSummary } from '../ScheduleSummaryCard/ScheduleSummaryCard';
import { DateTime } from 'luxon';

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
    {
      id: '523-zcf',
      prospectId: '764-fgh',
      title: 'The Strange Theft of a Priceless Churchill Portrait',
      scheduledSurfaceGuid: 'NEW_TAB_EN_US',
      prospectType: 'organic-timespent',
      url: 'https://thewalrus.ca/churchill-portrait/',
      imageUrl: 'https://placeimg.com/640/480/people?random=495',
      excerpt:
        'The inside story of one of Canada’s most brazen, baffling, and mysterious art heists and how the police cracked it.',
      language: CorpusLanguage.En,
      publisher: 'The Walrus',
      authors: 'Brett Popplewell',
      saveCount: 111222,
      isSyndicated: false,
      approvedCorpusItem: {
        externalId: '123-abc',
        createdBy: 'test-user',
        hasTrustedDomain: true,
        isTimeSensitive: false,
        source: CorpusItemSource.Manual,
        status: CuratedStatus.Recommendation,
        createdAt: DateTime.local().millisecond,
        updatedAt: DateTime.local().millisecond,
        scheduledSurfaceHistory: [],
        authors: [{ name: 'Brett Popplewell', sortOrder: 0 }],
        title: 'The Strange Theft of a Priceless Churchill Portrait',
        url: 'https://thewalrus.ca/churchill-portrait/',
        excerpt:
          'The inside story of one of Canada’s most brazen, baffling, and mysterious art heists and how the police cracked it.',
        imageUrl: 'https://placeimg.com/640/480/people?random=495',
        language: CorpusLanguage.En,
        publisher: 'The Walrus',
        topic: Topics.Education,
        isCollection: false,
        isSyndicated: false,
      },
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

  // const mockSetFilters = jest.fn();
  //
  // const filterData: StoriesSummary[] = [
  //   { name: 'Topic 1', count: 10 },
  //   { name: 'Topic 2', count: 20 },
  //   { name: 'Topic 3', count: 0 },
  // ];
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

    // should be 3 different topics
    // last prospect has prospect.topic set to null, but has an
    // approvedCorpusItem which has the topic set.
    const topicFilter = screen.getByText(/Topics 3/i);
    expect(topicFilter).toBeInTheDocument();
  });
});
