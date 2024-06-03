import {
  CorpusLanguage,
  GetRejectedItemsQuery,
  Topics,
} from '../../api/generatedTypes';
import { constructMock } from './utils';
import { getRejectedItems } from '../../api/queries/getRejectedItems';

const data: GetRejectedItemsQuery['getRejectedCorpusItems'] = {
  totalCount: 1,
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: '123-abc',
    endCursor: '123-abc',
  },
  edges: [
    {
      cursor: '123-abc',
      node: {
        externalId: '123-abc',
        createdAt: 1635014926,
        createdBy: 'Amy',
        language: CorpusLanguage.En,
        prospectId: '456-cde',
        publisher: 'Roga Y Kopyta',
        reason: 'Not a good story, full stop!',
        title: 'Rejected story #1',
        topic: Topics.Politics,
        url: 'https://www.test.com/not-a-good-story',
      },
    },
  ],
};

/**
 * Return all the mocked scheduled items
 */
export const mock_AllRejectedItems = constructMock(
  'getRejectedCorpusItems',
  getRejectedItems,
  { pagination: { first: 32 } },
  data,
);
