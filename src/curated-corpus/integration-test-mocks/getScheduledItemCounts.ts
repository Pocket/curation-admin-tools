import { constructMock } from './utils';
import { getScheduledItemCounts } from '../../api/queries/getScheduledItemCounts';

const scheduledItemCounts = {
  collectionCount: 0,
  syndicatedCount: 0,
  totalCount: 0,
};

const variables = {
  filters: {
    scheduledSurfaceGuid: 'dummyId',
    startDate: '2022-07-19',
    endDate: '2022-07-19',
  },
};

/**
 * Return mocked scheduled item counts
 */
export const mock_ScheduledItemCountsZero = constructMock(
  'getScheduledCorpusItems',
  getScheduledItemCounts,
  variables,
  scheduledItemCounts,
);
