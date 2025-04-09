import { removeSectionItem } from '../../api/mutations/removeSectionItem';
import { getTestApprovedItem } from '../helpers/approvedItem';
import { ActivitySource } from '../../api/generatedTypes';

export const successMock = {
  request: {
    query: removeSectionItem,
    variables: {
      data: {
        externalId: 'item-1',
        deactivateReasons: ['DATED'],
      },
    },
  },
  result: {
    data: {
      removeSectionItem: {
        externalId: 'item-1',
        approvedItem: getTestApprovedItem(),
        active: false,
        deactivateReasons: ['DATED'],
        deactivateSource: ActivitySource.Manual,
        deactivatedAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    },
  },
};
