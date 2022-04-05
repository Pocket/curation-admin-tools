// Here we keep sets of options for curating items
import {
  ApprovedCorpusItem,
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
const prospectFilters: DropdownOption[] = [{ code: '', name: 'All Sources' }];

Object.keys(ProspectType).forEach((key, index) => {
  prospectFilters.push({
    // this gives us a value like ORGANIC_TIMESPENT
    code: Object.values(ProspectType)[index],
    // this gives us a value like OrganicTimespent
    name: key,
  });
});

export const prospectFilterOptions: DropdownOption[] = prospectFilters;

// Language codes. Currently only English and German are needed.
export const languages: DropdownOption[] = [
  { code: CorpusLanguage.En, name: 'English' },
  { code: CorpusLanguage.De, name: 'German' },
];

// This maps to the status (CuratedStatus type) field in DB for an ApprovedItem
export const curationStatusOptions: DropdownOption[] = [
  { code: CuratedStatus.Recommendation, name: 'Recommendation' },
  { code: CuratedStatus.Corpus, name: 'Corpus' },
];

/**
 *  This type is only being used as the return type for the helper function transformProspectToApprovedItem().
  It is meant to be a bridge between the Prospect and ApprovedCorpusItem graphql types.
  ApprovedCorpusItem has language as a required field and Prospect has it as a possible undefined.
  When mapping a Prospect to an ApprovedCorpusItem type, we need to able to set the language to undefined
  for when it is undefined on the Prospect, which later will be set in the form before creating an Approved item
 */
export type ApprovedItemFromProspect = Omit<ApprovedCorpusItem, 'language'> & {
  language: CorpusLanguage | undefined;
};
