import { updateLabel } from '../../api/mutations/updateLabel';

export const updateLabel1SuccessMock = {
  request: {
    query: updateLabel,
    variables: {
      data: {
        externalId: 'label-1',
        name: 'fake-new-label',
      },
    },
  },
  result: {
    data: {
      updateLabel: {
        externalId: 'label-1',
        name: 'fake-new-label',
      },
    },
  },
};

export const updateDuplicateLabelErrorMock = {
  request: {
    query: updateLabel,
    variables: {
      data: {
        externalId: 'duplicate-label',
        name: 'fake-label-duplicate-update',
      },
    },
  },
  error: new Error(
    'A label with the name "fake-label-duplicate-update" already exists'
  ),
};

//Cannot update label; it is associated with at least one collection
export const updateCollectionLabelAssociationErrorMock = {
  request: {
    query: updateLabel,
    variables: {
      data: {
        externalId: 'label-1',
        name: 'fake-obsessed-label',
      },
    },
  },
  error: new Error(
    'Cannot update label; it is associated with at least one collection'
  ),
};
