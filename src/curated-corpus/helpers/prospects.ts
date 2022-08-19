import {
  ApprovedItemFromProspect,
  DropdownOption,
  prospectFilterOptions,
} from './definitions';
import {
  CorpusItemSource,
  CuratedStatus,
  Prospect,
  ProspectType,
} from '../../api/generatedTypes';
import { transformAuthors } from '../../_shared/utils/transformAuthors';

/**
 * This helper function takes all possible prospect filter options for the filtering
 * dropdown on the Prospecting page and cuts the list down to the ones available for
 * a given Scheduled Surface.
 */
export const getProspectFilterOptions = (
  data: ProspectType[]
): DropdownOption[] => {
  const availableProspectFilters: string[] = data.map(
    (prospectType) => prospectType
  );

  const filters: DropdownOption[] = prospectFilterOptions.filter((option) => {
    if (availableProspectFilters.includes(option.code) || option.code == '') {
      return option;
    }
  });

  return filters;
};

/**
 *
 * This function simply transforms a Prospect object type to
 * an Approved Curated Corpus Item type. This is used to
 * convert a prospect item into a "dummy" approved item in the
 * ProspectItemModal
 */
export const transformProspectToApprovedItem = (
  prospect: Prospect,
  isRecommendation: boolean,
  isManual: boolean
): ApprovedItemFromProspect => {
  return {
    externalId: '',
    prospectId: prospect.prospectId,
    url: prospect.url,
    title: prospect.title ?? '',
    imageUrl: prospect.imageUrl ?? '',
    authors: transformAuthors(prospect.authors),
    publisher: prospect.publisher ?? '',
    language: prospect.language || undefined,
    source: isManual ? CorpusItemSource.Manual : CorpusItemSource.Prospect,
    topic: prospect.topic ?? '',
    status: isRecommendation
      ? CuratedStatus.Recommendation
      : CuratedStatus.Corpus,
    isTimeSensitive: false,
    isSyndicated: prospect.isSyndicated ?? false,
    isCollection: prospect.isCollection ?? false,
    excerpt: prospect.excerpt ?? '',
    createdAt: prospect.createdAt ?? 0,
    createdBy: '',
    updatedAt: 0,
    scheduledSurfaceHistory:
      prospect.approvedCorpusItem?.scheduledSurfaceHistory ?? [],
  };
};
