import {
  ApprovedCuratedCorpusItem,
  CuratedStatus,
} from '../api/curated-corpus-api/generatedTypes';
import { Prospect } from '../api/prospect-api/generatedTypes';
/**
 *
 * This is a helper file that contains some helper functions. Right now
 * it only has one but we could add more to it
 */

/**
 *
 * This function simply transforms a Prospect object type to
 * an Approved Curated Corpus Item type. This is used to
 * convert a prospect item into a "dummy" approved item in the
 * ProspectItemModal
 */
export const transformProspectToApprovedItem = (
  prospect: Prospect,
  isRecommendation: boolean
): ApprovedCuratedCorpusItem => {
  return {
    externalId: '',
    prospectId: prospect.id,
    url: prospect.url,
    title: prospect.title ?? '',
    imageUrl: prospect.imageUrl ?? '',
    publisher: prospect.publisher ?? '',
    language: prospect.language ?? '',
    topic: prospect.topic ?? '',
    status: isRecommendation
      ? CuratedStatus.Recommendation
      : CuratedStatus.Corpus,
    isShortLived: false,
    isSyndicated: prospect.isSyndicated ?? false,
    isCollection: prospect.isCollection ?? false,
    excerpt: prospect.excerpt ?? '',
    createdAt: prospect.createdAt ?? 0,
    createdBy: '',
    updatedAt: 0,
  };
};
