import { applyCurlyQuotes } from './applyCurlyQuotes';

describe('applyCurlyQuotes', () => {
  it('returns an empty string if no text added', () => {
    const result = applyCurlyQuotes('');
    expect(result).toEqual('');
  });

  it('adds single open curly apostrophe for straight apostrophe', () => {
    const result = applyCurlyQuotes("Here's to the great ones!");
    expect(result).toEqual('Here‘s to the great ones!');
  });

  it('adds double curly apostrophes for straight apostrophe wrapping text', () => {
    const result = applyCurlyQuotes('Here\'s a quote - "To be or not to be"');
    expect(result).toEqual('Here‘s a quote - “To be or not to be”');
  });

  it('adds single curly apostrophes for straight apostrophes wrapping text', () => {
    const result = applyCurlyQuotes("Here's a quote - 'To be or not to be'");
    expect(result).toEqual('Here‘s a quote - ‘To be or not to be’');
  });
});
