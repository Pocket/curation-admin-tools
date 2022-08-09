import { approvedCorpusItem, getTestApprovedItem } from './approvedItem';

describe('helper functions related to approvedItem', () => {
  describe('getTestApprovedItem function', () => {
    it('should return an approved corpus item with default test properties', () => {
      // Very trivial test. Asserting against the same object the function is returning
      expect(getTestApprovedItem()).toStrictEqual(approvedCorpusItem);
    });

    it('should return an approved corpus item with the default test properties overwritten', () => {
      const modifiedProperties = {
        createdBy: 'mbob',
        updatedBy: 'rjoe',
        isSyndicated: true,
      };

      expect(getTestApprovedItem({ ...modifiedProperties })).toStrictEqual({
        ...approvedCorpusItem,
        ...modifiedProperties,
      });
    });
  });
});
