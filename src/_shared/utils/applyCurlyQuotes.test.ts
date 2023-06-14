import { applyCurlyQuotes } from './applyCurlyQuotes';

describe('flattenAuthors', () => {
  it('returns an empty string if no text added', () => {
    const result = applyCurlyQuotes('');
    expect(result).toEqual('');
  });

  it('adds single open curly quote for straight quote', () => {
    const result = applyCurlyQuotes("Here's to the great ones!");
    expect(result).toEqual('Here‘s to the great ones!');
  });

  it('adds double open curly quote for straight quote', () => {
    const result = applyCurlyQuotes("Here's to the great ones!");
    expect(result).toEqual('Here‘s to the great ones!');
  });
});
