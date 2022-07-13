import { constructMock } from './utils';
import { getScheduledItemCounts } from '../../api/queries/getScheduledItemCounts';

const scheduledItemCounts = {
  collectionCount: 0,
  syndicatedCount: 0,
  totalCount: 0,
};

/**
 * Return mocked scheduled item counts
 */
export const mock_ScheduledItemCountsZero = constructMock(
  'getScheduledItems',
  getScheduledItemCounts,
  scheduledItemCounts
);
