// import { dismissProspect } from '../../api/mutations/dismissProspect';
import { getTestProspect } from '../helpers/prospects';
import { removeProspect } from '../../api/mutations/removeProspect';
import { RemoveProspectInput } from '../../api/generatedTypes';

const input: RemoveProspectInput = {
  id: getTestProspect().id,
};
export const successMock = {
  request: {
    query: removeProspect,
    variables: { data: input },
  },
  result: { data: { removeProspect: getTestProspect() } },
};

export const errorMessage = 'Could not dismiss prospect';

export const errorMock = {
  request: {
    query: removeProspect,
    variables: { data: input },
  },
  result: {
    data: { removeProspect: null },
    error: new Error(errorMessage),
  },
};
