import { ActionScreen } from '../../api/generatedTypes';

import { deleteScheduledItem } from '../../api/mutations/deleteScheduledItem';
import { getTestScheduledItem } from '../helpers/scheduledItem';

const item = getTestScheduledItem();

export const successMock = {
  request: {
    query: deleteScheduledItem,
    variables: {
      data: {
        externalId: item.externalId,
        actionScreen: ActionScreen.Schedule,
      },
    },
  },
  result: { data: { deleteScheduledCorpusItem: item } },
};
