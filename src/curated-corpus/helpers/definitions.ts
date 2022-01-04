// Here we keep sets of options for curating items
import {
  CuratedStatus,
  ProspectType,
} from '../api/curated-corpus-api/generatedTypes';

export interface DropdownOption {
  code: string;
  name: string;
}
// This is a list of topics. The 15 "standard" topics + coronavirus.
export const topics: DropdownOption[] = [
  { code: 'BUSINESS', name: 'Business' },
  { code: 'CAREER', name: 'Career' },
  { code: 'CORONAVIRUS', name: 'Coronavirus' },
  { code: 'EDUCATION', name: 'Education' },
  { code: 'ENTERTAINMENT', name: 'Entertainment' },
  { code: 'FOOD', name: 'Food' },
  { code: 'GAMING', name: 'Gaming' },
  { code: 'HEALTH_FITNESS', name: 'Health & Fitness' },
  { code: 'PARENTING', name: 'Parenting' },
  { code: 'PERSONAL_FINANCE', name: 'Personal Finance' },
  { code: 'POLITICS', name: 'Politics' },
  { code: 'SCIENCE', name: 'Science' },
  { code: 'SELF_IMPROVEMENT', name: 'Self Improvement' },
  { code: 'SPORTS', name: 'Sports' },
  { code: 'TECHNOLOGY', name: 'Technology' },
  { code: 'TRAVEL', name: 'Travel' },
];

// All the possible Prospect types for filtering
export const prospectFilterOptions: DropdownOption[] = [
  { code: '', name: 'All Sources' },
  { code: ProspectType.Global, name: 'Global' },
  { code: ProspectType.OrganicTimespent, name: 'Time Spent' },
  { code: ProspectType.Syndicated, name: 'Syndicated' },
];

// New Tab as it exists on Prospect API.
export type NewTab = {
  name: string;
  guid: string;
  utcOffset: number;
  prospectTypes: ProspectType[];
};

// And this can be used for New Tab scheduling dropdowns.
// 'name' as a display value and 'guid' as actual value sent to the API
export const newTabs: NewTab[] = [
  {
    name: 'en-US',
    guid: 'EN_US',
    utcOffset: -4000,
    prospectTypes: [
      ProspectType.Global,
      ProspectType.OrganicTimespent,
      ProspectType.Syndicated,
    ],
  },
  {
    name: 'de-DE',
    guid: 'DE_DE',
    utcOffset: 1000,
    prospectTypes: [ProspectType.Global],
  },
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
