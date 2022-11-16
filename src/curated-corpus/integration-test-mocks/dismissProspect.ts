import { dismissProspect } from '../../api/mutations/dismissProspect';
import { getTestProspect } from '../helpers/prospects';

export const successMock = {
  request: {
    query: dismissProspect,
    variables: { id: getTestProspect().id },
  },
  result: { data: { dismissProspect: getTestProspect() } },
};

export const errorMessage = 'Could not dismiss prospect';

export const errorMock = {
  request: {
    query: dismissProspect,
    variables: { id: getTestProspect().id },
  },
  result: {
    data: { dismissProspect: null },
    error: new Error(errorMessage),
  },
};
