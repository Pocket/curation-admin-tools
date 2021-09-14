import { transformAuthors } from './transformAuthors';

describe('transformAuthors', () => {
  it('processes a string with commas then spaces', () => {
    const result = transformAuthors('the dude, walter');

    expect(result.length).toEqual(2);
  });

  it('processes a string with commas and no spaces', () => {
    const result = transformAuthors('the dude,walter');

    expect(result.length).toEqual(2);
  });

  it('trims extra spaces off author names and keeps spaces within names', () => {
    const result = transformAuthors('  the dude,   walter ,maude lebowski');

    expect(result[0].name).toEqual('the dude');
    expect(result[1].name).toEqual('walter');
    expect(result[2].name).toEqual('maude lebowski');
  });

  it('generates the correct sort order', () => {
    const result = transformAuthors('the dude, walter, maude lebowski');

    expect(result[0].name).toEqual('the dude');
    expect(result[0].sortOrder).toEqual(0);
    expect(result[1].name).toEqual('walter');
    expect(result[1].sortOrder).toEqual(1);
    expect(result[2].name).toEqual('maude lebowski');
    expect(result[2].sortOrder).toEqual(2);
  });

  it('return an empty array if the author string is empty', () => {
    const result = transformAuthors('');

    expect(result.length).toEqual(0);
  });

  it('return an empty array if the author string is just spaces', () => {
    const result = transformAuthors('    ');

    expect(result.length).toEqual(0);
  });
});
