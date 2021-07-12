import { flattenAuthors } from './flattenAuthors';

describe('flattenAuthors', () => {
  it('returns an empty string if author array is empty', () => {
    const result = flattenAuthors([]);

    expect(result).toEqual('');
  });

  it('returns the name of the author if only one has been supplied', () => {
    const result = flattenAuthors([
      { name: 'Louis Mountbatten', sortOrder: 1 },
    ]);

    expect(result).toEqual('Louis Mountbatten');
  });

  it('returns a comma-separated string of authors if more than one supplied', () => {
    const result = flattenAuthors([
      {
        name: 'Louis Mountbatten',
        sortOrder: 1,
      },
      { name: 'Edwina Ashley', sortOrder: 2 },
    ]);

    expect(result).toEqual('Louis Mountbatten, Edwina Ashley');
  });
});
