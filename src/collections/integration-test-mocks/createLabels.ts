import { createLabel } from '../../api/mutations/createLabel';

export const createLabel1SuccessMock = {
  request: {
    query: createLabel,
    variables: {
      name: 'fake-label-1',
    },
  },
  result: {
    data: {
      createLabel: {
        externalId: 'a1',
        name: 'fake-label-1',
      },
    },
  },
};

export const createLabel2SuccessMock = {
  request: {
    query: createLabel,
    variables: {
      name: 'fake-label-2',
    },
  },
  result: {
    data: {
      createLabel: {
        externalId: 'a2',
        name: 'fake-label-2',
      },
    },
  },
};

export const createDuplicateLabelErrorMock = {
  request: {
    query: createLabel,
    variables: {
      name: 'fake-label-duplicate',
    },
  },
  error: new Error(
    'A label with the name "fake-label-duplicate" already exists'
  ),
};

export const createMinCharLabelErrorMock = {
  request: {
    query: createLabel,
    variables: {
      name: 'a',
    },
  },
  error: new Error('Label name needs to be at least 2 characters.'),
};

export const createBadCharLabelErrorMock = {
  request: {
    query: createLabel,
    variables: {
      name: 'fake-label!',
    },
  },
  error: new Error(
    'Label name can only contain lowercase alphanumeric characters and hyphens.'
  ),
};
