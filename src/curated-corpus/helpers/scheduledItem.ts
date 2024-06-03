import {
  ScheduledCorpusItem,
  ScheduledItemSource,
} from '../../api/generatedTypes';
import { getTestApprovedItem } from './approvedItem';
import { ScheduledSurfaces } from './definitions';

export const scheduledItem: ScheduledCorpusItem = {
  externalId: '456-qwerty',
  scheduledDate: '2024-01-01',
  scheduledSurfaceGuid: ScheduledSurfaces[0].guid, // New Tab EN-US
  source: ScheduledItemSource.Manual,
  createdAt: 1635014927,
  createdBy: 'Amy',
  updatedAt: 1635014927,
  updatedBy: 'Amy',
  approvedItem: getTestApprovedItem(),
};

/**
 * @param options to override certain properties and customize the approved corpus item
 * @returns Returns a test object of type ApprovedCorpusItem
 */
export const getTestScheduledItem = (
  options?: Partial<ScheduledCorpusItem>,
): ScheduledCorpusItem => {
  return {
    ...scheduledItem,
    ...options,
  };
};
