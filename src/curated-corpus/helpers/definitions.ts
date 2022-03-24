// Here we keep sets of options for curating items
import {
  ApprovedCuratedCorpusItem,
  CorpusLanguage,
  CuratedStatus,
  ProspectType,
  Topics,
} from '../../api/generatedTypes';

export interface DropdownOption {
  code: string;
  name: string;
}
// This is a list of topics. The 15 "standard" topics + coronavirus.
export const topics: DropdownOption[] = [
  { code: Topics.Business, name: 'Business' },
  { code: Topics.Career, name: 'Career' },
  { code: Topics.Coronavirus, name: 'Coronavirus' },
  { code: Topics.Education, name: 'Education' },
  { code: Topics.Entertainment, name: 'Entertainment' },
  { code: Topics.Food, name: 'Food' },
  { code: Topics.Gaming, name: 'Gaming' },
  { code: Topics.HealthFitness, name: 'Health & Fitness' },
  { code: Topics.Parenting, name: 'Parenting' },
  { code: Topics.PersonalFinance, name: 'Personal Finance' },
  { code: Topics.Politics, name: 'Politics' },
  { code: Topics.Science, name: 'Science' },
  { code: Topics.SelfImprovement, name: 'Self Improvement' },
  { code: Topics.Sports, name: 'Sports' },
  { code: Topics.Technology, name: 'Technology' },
  { code: Topics.Travel, name: 'Travel' },
];

// All the possible Prospect types for filtering
export const prospectFilterOptions: DropdownOption[] = [
  { code: '', name: 'All Sources' },
  { code: ProspectType.Global, name: 'Global' },
  { code: ProspectType.OrganicTimespent, name: 'Time Spent' },
  { code: ProspectType.Syndicated, name: 'Syndicated' },
];

// Language codes. Currently only English and German are needed.
export const languages: DropdownOption[] = [
  { code: 'EN', name: 'English' },
  { code: 'DE', name: 'German' },
];

// This maps to the status (CuratedStatus type) field in DB for an ApprovedItem
export const curationStatusOptions: DropdownOption[] = [
  { code: CuratedStatus.Recommendation, name: 'Recommendation' },
  { code: CuratedStatus.Corpus, name: 'Corpus' },
];

/**
 *  This type is only being used as the return type for the helper function transformProspectToApprovedItem().
  It is meant to be a bridge between the Prospect and ApprovedCuratedCorpus graphql types.
  ApprovedCuratedCorpusItem has language as a required field and Prospect has it as a possible undefined.
  When mapping a Prospect to an ApprovedCuratedCorpusItem type, we need to able to set the language to undefined
  for when it is undefined on the Prospect, which later will be set in the form before creating an Approved item
 */
export type ApprovedItemFromProspect = Omit<
  ApprovedCuratedCorpusItem,
  'language'
> & {
  language: CorpusLanguage | undefined;
};
