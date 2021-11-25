import { expect } from 'chai';
import { groupByObjectPropertyValue } from './groupByObjectPropertyValue';

describe('groupByObjectPropertyValue', () => {
  it('returns an empty object if input array is empty', () => {
    const result = groupByObjectPropertyValue([], 'prop');

    expect(result).to.be.empty;
  });

  it('returns an empty object if property to group by is missing', () => {
    const result = groupByObjectPropertyValue(
      [{ group: 1 }, { group: 2 }],
      'prop'
    );

    expect(result).to.be.empty;
  });

  it('groups objects into one array if prop value is the same for all objects', () => {
    const input = [
      { groupId: 12, name: 'Andy' },
      { groupId: 12, name: 'Andrew' },
      { groupId: 12, name: 'Drew' },
      { groupId: 12, name: 'Anders' },
      { groupId: 12, name: 'Andre' },
      { groupId: 12, name: 'Andrei' },
    ];

    const result = groupByObjectPropertyValue(input, 'groupId');

    expect(result[12]).to.deep.equal(input);
  });

  it('groups objects into multiple groups by prop value', () => {
    const input = [
      { groupId: 1, name: 'Andy' },
      { groupId: 1, name: 'Andrew' },
      { groupId: 3, name: 'Drew' },
      { groupId: 5, name: 'Anders' },
      { groupId: 5, name: 'Andre' },
      { groupId: 5, name: 'Andrei' },
    ];

    const result = groupByObjectPropertyValue(input, 'groupId');

    expect(result[1]).to.have.lengthOf(2);
    expect(result[3]).to.have.lengthOf(1);
    expect(result[5]).to.have.lengthOf(3);
  });
});
