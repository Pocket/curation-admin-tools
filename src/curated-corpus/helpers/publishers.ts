import { StoriesSummary } from '../components';

/**
 * Extracts a summary of publisher data from scheduled corpus item data.
 *
 * @param data
 */
export const getGroupedPublisherData = (data: string[]): StoriesSummary[] => {
  const publishers: StoriesSummary[] = [];

  data.forEach((publisher) => {
    const existingEntry = publishers.find((entry) => entry.name === publisher);

    existingEntry
      ? (existingEntry.count += 1)
      : publishers.push({ name: publisher, count: 1 });
  });

  // Sort publishers in descending order - most frequent on top
  // And do a secondary sort within publishers with equal counts
  // to list them in alphabetical order
  publishers.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return publishers;
};
