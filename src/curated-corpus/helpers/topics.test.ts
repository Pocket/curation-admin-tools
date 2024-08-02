import { getDisplayTopic, getGroupedTopicData } from './topics';
import { Topics } from '../../api/generatedTypes';
import { expect } from 'chai';

describe('helper functions related to topics', () => {
  describe('getDisplayTopic function', () => {
    it('returns a capitalised display name for a one-word topic', () => {
      const displayTopic = getDisplayTopic(Topics.Technology);
      expect(displayTopic).to.equal('Technology');
    });

    it('returns a capitalised display name for a multiple-word topic', () => {
      const displayTopic = getDisplayTopic(Topics.HealthFitness);
      expect(displayTopic).to.equal('Health & Fitness');
    });

    it('returns "N/A" if topic is undefined', () => {
      const displayTopic = getDisplayTopic(undefined);
      expect(displayTopic).to.equal('N/A');
    });

    it('returns "N/A" if topic is not part of shared data topic list', () => {
      const displayTopic = getDisplayTopic('BEST_BOOKS');
      expect(displayTopic).to.equal('N/A');
    });
  });

  describe('getGroupedTopicData', () => {
    const data = [
      'Health & Fitness',
      'Career',
      'Travel',
      'Health & Fitness',
      'Sports',
      'Travel',
      'Food',
    ];

    it('groups entries by topic name', () => {
      const topics = getGroupedTopicData(data);

      // There are five distinct topics in mock data
      expect(topics).to.be.an('array');
      // However, we're getting the entire list of topics here,
      // not just the ones stories belong to
      expect(topics).to.have.lengthOf(16);

      // And we expect to see the story topics, with the correct counts
      expect(topics).to.contain.deep.members([
        { name: 'Health & Fitness', count: 2 },
      ]);
      expect(topics).to.contain.deep.members([{ name: 'Travel', count: 2 }]);
      expect(topics).to.contain.deep.members([{ name: 'Career', count: 1 }]);
      expect(topics).to.contain.deep.members([{ name: 'Sports', count: 1 }]);
      expect(topics).to.contain.deep.members([{ name: 'Food', count: 1 }]);

      // I'll just look up one of the zero-count topics
      expect(topics).to.contain.deep.members([{ name: 'Gaming', count: 0 }]);
    });

    it('sorts entries by most frequent topic first', () => {
      const topics = getGroupedTopicData(data);

      expect(topics[0].count).to.equal(2);
      expect(topics[1].count).to.equal(2);
      expect(topics[2].count).to.equal(1);
    });

    it('sorts entries by alphabetical order within the same # of appearances', () => {
      const topics = getGroupedTopicData(data);

      expect(topics[0].name).to.equal('Health & Fitness');
      expect(topics[1].name).to.equal('Travel');

      expect(topics[2].name).to.equal('Career');
      expect(topics[3].name).to.equal('Food');
      expect(topics[4].name).to.equal('Sports');
    });

    it('handles empty data', () => {
      const topics = getGroupedTopicData([]);
      expect(topics).to.be.an('array').with.lengthOf(0);
    });

    it('returns an abbreviated list if not all topics are requested', () => {
      const topics = getGroupedTopicData(data, false);
      expect(topics).to.be.an('array').with.lengthOf(5);
    });

    it('returns a list of topics without "Coronavirus" if requested', () => {
      const topics = getGroupedTopicData(data, true, false);
      expect(topics).to.be.an('array').with.lengthOf(16);
    });

    it('returns a full list of topics if requested', () => {
      const topics = getGroupedTopicData(data);
      expect(topics).to.be.an('array').with.lengthOf(17);
    });
  });
});
