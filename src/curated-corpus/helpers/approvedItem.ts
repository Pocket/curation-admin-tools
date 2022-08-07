import {
  ApprovedCorpusItem,
  CorpusItemSource,
  CorpusLanguage,
  CuratedStatus,
  Topics,
} from '../../api/generatedTypes';

export const approvedCorpusItem: ApprovedCorpusItem = {
  externalId: '123-abc',
  prospectId: '123-xyz',
  title: 'How To Win Friends And Influence People with React',
  url: 'http://www.test.com/how-to',
  imageUrl: 'https://placeimg.com/640/480/people?random=494',
  excerpt: 'Everything You Wanted to Know About React and Were Afraid To Ask',
  language: CorpusLanguage.De,
  authors: [{ name: 'One Author', sortOrder: 1 }],
  publisher: 'Amazing Inventions',
  topic: Topics.HealthFitness,
  source: CorpusItemSource.Prospect,
  status: CuratedStatus.Recommendation,
  isCollection: false,
  isSyndicated: false,
  isTimeSensitive: false,
  createdAt: 1635014926,
  createdBy: 'Amy',
  updatedAt: 1635114926,
  scheduledSurfaceHistory: [],
};

/**
 * @param options to override certain properties and customize the approved corpus item
 * @returns Returns a test object of type ApprovedCorpusItem
 */
export const getTestApprovedItem = (
  options?: Partial<ApprovedCorpusItem>
): ApprovedCorpusItem => {
  return {
    ...approvedCorpusItem,
    ...options,
  };
};
