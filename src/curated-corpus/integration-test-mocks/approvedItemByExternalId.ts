import {
  ApprovedCorpusItem,
  CorpusItemSource,
  CorpusLanguage,
  CuratedStatus,
  Topics,
} from '../../api/generatedTypes';
import { constructMock } from './utils';
import { approvedItemByExternalId } from '../../api/queries/approvedItemByExternalId';

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
  scheduledSurfaceHistory: [], // TODO: fill this out
  source: CorpusItemSource.Prospect,
  authors: [
    {
      name: 'Octavia Butler',
      sortOrder: 1,
    },
  ],
};

/**
 * Return the mocked approvedItem
 */
export const mock_approvedItemByExternalId = constructMock(
  'approvedCorpusItemByExternalId',
  approvedItemByExternalId,
  { externalId: approvedItem.externalId },
  approvedItem
);

/**
 * Return a null (approved item is not found)
 */
export const mock_approvedItemByExternalIdNoResults = constructMock(
  'approvedCorpusItemByExternalId',
  approvedItemByExternalId,
  { externalId: approvedItem.externalId },
  null
);
