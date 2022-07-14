import {
  CorpusItemSource,
  CorpusLanguage,
  CuratedStatus,
  ScheduledCorpusItem,
} from '../../api/generatedTypes';
import { constructMock } from './utils';
import { getScheduledItems } from '../../api/queries/getScheduledItems';

const scheduledItems: ScheduledCorpusItem[] = [
  {
    externalId: '456-qwerty',
    scheduledDate: '2030-01-01',
    createdAt: 1635014926,
    createdBy: 'Amy',
    updatedAt: 1635014926,
    updatedBy: 'Amy',
    scheduledSurfaceGuid: 'NEW_TAB_EN_US',
    approvedItem: {
      externalId: '123-abc',
      prospectId: '123-xyz',
      title: 'How To Win Friends And Influence People with React',
      url: 'http://www.test.com/how-to',
      imageUrl: 'https://placeimg.com/640/480/people?random=494',
      excerpt:
        'Everything You Wanted to Know About React and Were Afraid To Ask',
      language: CorpusLanguage.De,
      publisher: 'Amazing Inventions',
      topic: 'Technology',
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
    },
  },
];

/**
 * Return all the mocked scheduled items
 */
export const mock_scheduledItems = constructMock(
  'getScheduledItems',
  getScheduledItems,
  scheduledItems
);
