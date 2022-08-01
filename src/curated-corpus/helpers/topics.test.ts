import { getDisplayTopic } from './topics';
import { Topics } from '../../api/generatedTypes';

describe('helper functions related to topics', () => {
  describe('getDisplayTopic function', () => {
    it('returns a capitalised display name for a one-word topic', () => {
      const displayTopic = getDisplayTopic(Topics.Technology);
      expect(displayTopic).toEqual('Technology');
    });

    it('returns a capitalised display name for a multiple-word topic', () => {
      const displayTopic = getDisplayTopic(Topics.HealthFitness);
      expect(displayTopic).toEqual('Health & Fitness');
    });

    it('returns "N/A" if topic is undefined', () => {
      const displayTopic = getDisplayTopic(undefined);
      expect(displayTopic).toEqual('N/A');
    });

    it('returns "N/A" if topic is not part of shared data topic list', () => {
      const displayTopic = getDisplayTopic('BEST_BOOKS');
      expect(displayTopic).toEqual('N/A');
    });
  });

  describe('getGroupedTopicData', () => {
    it.todo('add a test');
  });
});
