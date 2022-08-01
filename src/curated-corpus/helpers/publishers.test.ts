import { getGroupedPublisherData } from './publishers';
import { expect } from 'chai';

describe('helper functions related to publishers', () => {
  describe('getGroupedPublisherData', () => {
    const data = [
      'The New York Times',
      'Vanity Fair',
      'The New York Times',
      'The Verge',
      'Curbed',
      'The Guardian',
      'Curbed',
    ];

    it('groups entries by publisher name', () => {
      const publishers = getGroupedPublisherData(data);

      // There are five distinct publishers in mock data
      expect(publishers).to.be.an('array');
      expect(publishers).to.have.lengthOf(5);

      // And we expect to see them all there, with the correct counts
      expect(publishers).to.contain.deep.members([
        { name: 'Curbed', count: 2 },
      ]);
      expect(publishers).to.contain.deep.members([
        { name: 'The New York Times', count: 2 },
      ]);
      expect(publishers).to.contain.deep.members([
        { name: 'The Guardian', count: 1 },
      ]);
      expect(publishers).to.contain.deep.members([
        { name: 'The Verge', count: 1 },
      ]);
      expect(publishers).to.contain.deep.members([
        { name: 'Vanity Fair', count: 1 },
      ]);
    });

    it('sorts entries by most frequent publisher first', () => {
      const publishers = getGroupedPublisherData(data);

      expect(publishers[0].count).to.equal(2);
      expect(publishers[1].count).to.equal(2);
      expect(publishers[2].count).to.equal(1);
    });

    it('sorts entries by alphabetical order within the same # of appearances', () => {
      const publishers = getGroupedPublisherData(data);

      expect(publishers[0].name).to.equal('Curbed');
      expect(publishers[1].name).to.equal('The New York Times');

      expect(publishers[2].name).to.equal('The Guardian');
      expect(publishers[3].name).to.equal('The Verge');
      expect(publishers[4].name).to.equal('Vanity Fair');
    });

    it('handles empty data', () => {
      const publishers = getGroupedPublisherData([]);
      expect(publishers).to.be.an('array').with.lengthOf(0);
    });
  });
});
