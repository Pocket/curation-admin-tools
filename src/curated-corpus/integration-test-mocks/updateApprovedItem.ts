import { getTestApprovedItem } from '../helpers/approvedItem';
import { updateApprovedItem } from '../../api/mutations/updateApprovedItem';
import { ActionScreen } from '../../api/generatedTypes';

const item = getTestApprovedItem();

const data = {
  externalId: item.externalId,
  title: item.title,
  excerpt: item.excerpt,
  status: item.status,
  language: item.language,
  authors: item.authors,
  publisher: item.publisher,
  datePublished: item.datePublished,
  imageUrl: item.imageUrl,
  topic: item.topic,
  isTimeSensitive: item.isTimeSensitive,
  actionScreen: ActionScreen.Corpus,
};

export const successMock = {
  request: {
    query: updateApprovedItem,
    variables: {
      data,
    },
  },
  result: { data: { updateApprovedCorpusItem: item } },
};

export const successMockSansDatePublished = {
  request: {
    query: updateApprovedItem,
    variables: {
      data: { ...data, datePublished: null },
    },
  },
  result: { data: { updateApprovedCorpusItem: item } },
};
