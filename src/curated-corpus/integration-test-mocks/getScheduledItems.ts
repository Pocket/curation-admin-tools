import {
  ApprovedCorpusItem,
  CorpusItemSource,
  CorpusLanguage,
  CuratedStatus,
  GetScheduledItemsQuery,
  ScheduledCorpusItem,
  Topics,
} from '../../api/generatedTypes';
import { getScheduledItems } from '../../api/queries/getScheduledItems';
import { constructMock } from './utils';

// Never mind that we're scheduling the same item over and over...
const approvedItem: ApprovedCorpusItem = {
  externalId: '123-abc',
  prospectId: '123-xyz',
  title: 'How To Win Friends And Influence People with React',
  url: 'http://www.test.com/how-to',
  imageUrl: 'https://placeimg.com/640/480/people?random=494',
  excerpt: 'Everything You Wanted to Know About React and Were Afraid To Ask',
  language: CorpusLanguage.De,
  publisher: 'Amazing Inventions',
  topic: Topics.Politics,
  status: CuratedStatus.Recommendation,
  isCollection: false,
  isSyndicated: false,
  isTimeSensitive: false,
  createdAt: 1635014926,
  createdBy: 'Amy',
  updatedAt: 1635114926,
  scheduledSurfaceHistory: [],
  source: CorpusItemSource.Prospect,
  authors: [
    {
      name: 'Octavia Butler',
      sortOrder: 1,
    },
  ],
};

const scheduledItems: ScheduledCorpusItem[] = [
  {
    externalId: '456-qwerty',
    scheduledDate: '2030-01-01',
    createdAt: 1635014926,
    createdBy: 'Amy',
    updatedAt: 1635014926,
    updatedBy: 'Amy',
    scheduledSurfaceGuid: 'NEW_TAB_EN_US',
    approvedItem,
  },
  {
    externalId: '456-qwerty',
    scheduledDate: '2030-01-01',
    createdAt: 1635014926,
    createdBy: 'Amy',
    updatedAt: 1635014926,
    updatedBy: 'Amy',
    scheduledSurfaceGuid: 'NEW_TAB_EN_US',
    // Tweak topic & publisher to test ScheduleSummaryConnector
    approvedItem: {
      ...approvedItem,
      topic: Topics.PersonalFinance,
      publisher: 'Fantastic Computers',
      isSyndicated: false,
    },
  },
  {
    externalId: '456-qwerty',
    scheduledDate: '2030-01-01',
    createdAt: 1635014926,
    createdBy: 'Amy',
    updatedAt: 1635014926,
    updatedBy: 'Amy',
    scheduledSurfaceGuid: 'NEW_TAB_EN_US',
    approvedItem: {
      ...approvedItem,
      topic: Topics.HealthFitness,
      isSyndicated: false,
    },
  },
];

const data: GetScheduledItemsQuery['getScheduledCorpusItems'] = [
  {
    scheduledDate: '2023-01-01',
    collectionCount: 0,
    syndicatedCount: 0,
    totalCount: 1,
    items: scheduledItems,
  },
];

const variables = {
  filters: {
    scheduledSurfaceGuid: 'NEW_TAB_EN_US',
    startDate: '2023-01-01',
    endDate: '2023-01-01',
  },
};

/**
 * Return all the mocked scheduled items
 */
export const mock_scheduledItems = constructMock(
  'getScheduledCorpusItems',
  getScheduledItems,
  variables,
  data
);

export const mock_scheduledItemsNoResults = constructMock(
  'getScheduledCorpusItems',
  getScheduledItems,
  variables,
  [
    {
      scheduledDate: '2023-01-01',
      collectionCount: 0,
      syndicatedCount: 0,
      totalCount: 0,
      items: [],
    },
  ]
);
