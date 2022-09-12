import { getTestApprovedItem } from '../helpers/approvedItem';
import { updateApprovedItem } from '../../api/mutations/updateApprovedItem';

const item = getTestApprovedItem();

export const successMock = {
  request: {
    query: updateApprovedItem,
    variables: {
      data: {
        externalId: item.externalId,
        title: item.title,
        excerpt: item.excerpt,
        status: item.status,
        language: item.language,
        authors: item.authors,
        publisher: item.publisher,
        imageUrl: item.imageUrl,
        topic: item.topic,
        isTimeSensitive: item.isTimeSensitive,
      },
    },
  },
  result: { data: { updateApprovedCorpusItem: item } },
};
