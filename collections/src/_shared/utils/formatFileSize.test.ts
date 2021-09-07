import { formatFileSize } from './formatFileSize';

describe('formatFileSize', () => {
  it('returns correct file size for an empty file', () => {
    const humanReadableSize = formatFileSize(0);

    expect(humanReadableSize).toEqual('0 bytes');
  });

  it('returns correct file size for a small file', () => {
    const humanReadableSize = formatFileSize(1000);

    expect(humanReadableSize).toEqual('1000 bytes');
  });

  it('returns correct file size for a 64 kb file', () => {
    const humanReadableSize = formatFileSize(Math.pow(2, 16));

    expect(humanReadableSize).toEqual('64 kB');
  });

  it('returns correct file size for a 64 MB file', () => {
    const humanReadableSize = formatFileSize(Math.pow(2, 26));

    expect(humanReadableSize).toEqual('64 MB');
  });

  it('returns correct file size for a 64 GB file', () => {
    const humanReadableSize = formatFileSize(Math.pow(2, 36));

    expect(humanReadableSize).toEqual('64 GB');
  });

  it('returns correct file size for a small and "non-whole" file size', () => {
    const humanReadableSize = formatFileSize(500000);

    expect(humanReadableSize).toEqual('488 kB');
  });

  it('returns correct file size for a large and "non-whole" file size', () => {
    const humanReadableSize = formatFileSize(2000000);

    expect(humanReadableSize).toEqual('1.9 MB');
  });
});
