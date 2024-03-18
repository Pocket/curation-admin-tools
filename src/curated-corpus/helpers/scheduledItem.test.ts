import { getTestScheduledItem, scheduledItem } from './scheduledItem';

describe('helper functions related to scheduledItem', () => {
  describe('getTestScheduledItem function', () => {
    it('should return a scheduled item with default test properties', () => {
      // Very trivial test. Asserting against the same object the function is returning
      expect(getTestScheduledItem()).toStrictEqual(scheduledItem);
    });

    it('should return a scheduled item with the default test properties overwritten', () => {
      const modifiedProperties = {
        scheduledDate: '2025-02-02',
        createdBy: 'mbob',
        updatedBy: 'rjoe',
      };

      expect(getTestScheduledItem({ ...modifiedProperties })).toStrictEqual({
        ...scheduledItem,
        ...modifiedProperties,
      });
    });
  });
});
