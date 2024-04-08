import { ActionScreen, ScheduledItemSource } from '../../api/generatedTypes';

import { createScheduledCorpusItem } from '../../api/mutations/createScheduledCorpusItem';
import { getTestApprovedItem } from '../helpers/approvedItem';

/**
 * This mock is dependent on the scheduled date it is provided. This is set up
 * so that in the tests, it's possible to select today's date (the easiest option)
 * from the MUI date picker.
 *
 * @param scheduledDate
 */
export const successMock = (scheduledDate: string) => {
  return {
    request: {
      query: createScheduledCorpusItem,
      variables: {
        approvedItemExternalId: '123-abc',
        scheduledSurfaceGuid: 'NEW_TAB_EN_US',
        scheduledDate,
        source: ScheduledItemSource.Manual,
        actionScreen: ActionScreen.Schedule,
      },
    },
    result: {
      data: {
        createScheduledCorpusItem: {
          externalId: '456-qwerty',
          scheduledDate,
          createdAt: 1635014926,
          createdBy: 'Amy',
          updatedAt: 1635014926,
          updatedBy: 'Amy',
          scheduledSurfaceGuid: 'NEW_TAB_EN_US',
          approvedItem: getTestApprovedItem(),
        },
      },
    },
  };
};

export const errorMock = {
  request: {
    query: createScheduledCorpusItem,
    variables: {
      data: {
        approvedItemExternalId: '456-cde',
        scheduledSurfaceGuid: 'NEW_TAB_EN_US',
        scheduledDate: '2030-01-01',
      },
    },
  },
  result: {
    data: { createScheduledCorpusItem: null },
    error: new Error(
      'This story is already scheduled to appear on NEW_TAB_EN_US on Jan 1, 2030.'
    ),
  },
};
