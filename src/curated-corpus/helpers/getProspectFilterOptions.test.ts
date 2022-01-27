import { expect } from 'chai';
import { getProspectFilterOptions } from './getProspectFilterOptions';
import { ProspectType } from '../api/curated-corpus-api/generatedTypes';

describe('getProspectFilterOptions', () => {
  it('returns just the "All Sources" option if no prospect types are available', () => {
    const types: ProspectType[] = [];

    const options = getProspectFilterOptions(types);

    expect(options).to.have.lengthOf(1);
    expect(options[0].code).to.be.an.empty.string;
    expect(options[0].name).to.equal('All Sources');
  });

  it('returns all available options if all are present for given New Tab', () => {
    const types: ProspectType[] = [
      ProspectType.Global,
      ProspectType.OrganicTimespent,
      ProspectType.Syndicated,
    ];

    const options = getProspectFilterOptions(types);

    // 3 prospect types + 1 'All Sources' option
    expect(options).to.have.lengthOf(4);

    expect(options[0].code).to.be.an.empty.string;
    expect(options[0].name).to.equal('All Sources');

    expect(options[1].code).to.equal(ProspectType.Global);
    expect(options[1].name).to.equal('Global');

    expect(options[2].code).to.equal(ProspectType.OrganicTimespent);
    expect(options[2].name).to.equal('Time Spent');

    expect(options[3].code).to.equal(ProspectType.Syndicated);
    expect(options[3].name).to.equal('Syndicated');
  });

  it('returns a cut-down list of prospect types if only some are available for given New Tab', () => {
    const types: ProspectType[] = [ProspectType.Syndicated];

    const options = getProspectFilterOptions(types);

    // 1 prospect type + 1 'All Sources' option
    expect(options).to.have.lengthOf(2);

    expect(options[0].code).to.be.an.empty.string;
    expect(options[0].name).to.equal('All Sources');

    expect(options[1].code).to.equal(ProspectType.Syndicated);
    expect(options[1].name).to.equal('Syndicated');
  });
});
