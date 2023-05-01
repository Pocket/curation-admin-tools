import { moderateShareableList } from '../../api/mutations/moderateShareableList';
import {
  ShareableListComplete,
  ShareableListModerationStatus,
  ShareableListModerationReason,
  ShareableListVisibility,
} from '../../api/generatedTypes';

export const moderationDetailsMultiLineText =
  'Incidunt corrupti earum. Quasi aut qui magnam eum. ' +
  'Quia non dolores voluptatem est aut. Id officiis nulla est.\n' +
  'Harum et velit debitis. Quia assumenda commodi et dolor. ';

export const visibleList: ShareableListComplete = {
  externalId: '12345-qwerty',
  user: { id: '12345' },
  title: 'Test list title',
  description: 'Some description',
  slug: 'test-list-title',
  status: ShareableListVisibility.Public,
  moderationStatus: ShareableListModerationStatus.Visible,
  listItemNoteVisibility: ShareableListVisibility.Private,
  createdAt: '2023-03-27T11:54:03.000Z',
  updatedAt: '2023-03-28T23:09:57.000Z',
  listItems: [],
};

export const hiddenList: ShareableListComplete = {
  externalId: '12345-qwerty',
  user: { id: '12345' },
  title: 'Test list title',
  description: 'Some description',
  slug: 'test-list-title',
  status: ShareableListVisibility.Public,
  moderationStatus: ShareableListModerationStatus.Hidden,
  moderationReason: ShareableListModerationReason.Spam,
  moderationDetails: 'bad content',
  listItemNoteVisibility: ShareableListVisibility.Private,
  createdAt: '2023-03-27T11:54:03.000Z',
  updatedAt: '2023-03-28T23:09:57.000Z',
  listItems: [],
};

export const moderateShareableList1SuccessMock = {
  request: {
    query: moderateShareableList,
    variables: {
      data: {
        externalId: visibleList.externalId,
        moderationStatus: ShareableListModerationStatus.Hidden,
        moderationReason: 'SPAM',
        moderationDetails: moderationDetailsMultiLineText,
      },
    },
  },
  result: {
    data: {
      moderateShareableList: {
        ...visibleList,
        moderationStatus: ShareableListModerationStatus.Hidden,
        moderationReason: 'SPAM',
        moderationDetails: moderationDetailsMultiLineText,
        updatedAt: new Date(),
      },
    },
  },
};

export const restoreShareableList1SuccessMock = {
  request: {
    query: moderateShareableList,
    variables: {
      data: {
        externalId: hiddenList.externalId,
        moderationStatus: ShareableListModerationStatus.Visible,
        restorationReason: moderationDetailsMultiLineText,
      },
    },
  },
  result: {
    data: {
      moderateShareableList: {
        ...visibleList,
        moderationStatus: ShareableListModerationStatus.Visible,
        restorationReason: moderationDetailsMultiLineText,
        updatedAt: new Date(),
      },
    },
  },
};
