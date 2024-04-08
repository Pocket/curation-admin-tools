import { ActionScreen } from '../../api/generatedTypes';

import { rejectApprovedItem } from '../../api/mutations/rejectApprovedItem';
import { getTestApprovedItem } from '../helpers/approvedItem';

export const successMock = {
  request: {
    query: rejectApprovedItem,
    variables: {
      data: {
        externalId: '123-abc',
        reason: 'TIME_SENSITIVE',
        actionScreen: ActionScreen.Schedule,
      },
    },
  },
  result: { data: { rejectApprovedCorpusItem: getTestApprovedItem() } },
};

export const errorMock = {
  request: {
    query: rejectApprovedItem,
    variables: { data: { externalId: '456-cde', reason: 'TIME_SENSITIVE' } },
  },
  result: {
    data: { rejectApprovedCorpusItem: null },
    error: new Error(
      'Cannot remove item from approved corpus - scheduled entries exist.'
    ),
  },
};
