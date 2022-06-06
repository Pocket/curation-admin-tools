import { expect } from 'chai';
import { getProspectFilterOptions } from './getProspectFilterOptions';
import { ProspectType } from '../../api/generatedTypes';

describe('getProspectFilterOptions', () => {
  it('returns just the "All Sources" option if no prospect types are available', () => {
    const types: ProspectType[] = [];

    const options = getProspectFilterOptions(types);

    expect(options).to.have.lengthOf(1);
    expect(options[0].code).to.be.an.empty.string;
    expect(options[0].name).to.equal('All Sources');
  });

  it('returns all available options if all are present for given Scheduled Surface', () => {
    const types: ProspectType[] = Object.values(ProspectType);

    const options = getProspectFilterOptions(types);

    // all prospect types + 1 'All Sources' option
    expect(options).to.have.lengthOf(Object.values(ProspectType).length + 1);

    // first option should be 'All Sources'
    expect(options[0].code).to.be.an.empty.string;
    expect(options[0].name).to.equal('All Sources');
  });

  it('returns a cut-down list of prospect types if only some are available for given Scheduled Surface', () => {
    const types: ProspectType[] = [ProspectType.SyndicatedNew];

    const options = getProspectFilterOptions(types);

    // 1 prospect type + 1 'All Sources' option
    expect(options).to.have.lengthOf(2);

    expect(options[0].code).to.be.an.empty.string;
    expect(options[0].name).to.equal('All Sources');

    expect(options[1].code).to.equal(ProspectType.SyndicatedNew);
    expect(options[1].name).to.equal('SyndicatedNew');
  });
});
