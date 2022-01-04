// Here we keep sets of options for curating items
import {
  CuratedStatus,
  ProspectType,
  Topics,
} from '../api/curated-corpus-api/generatedTypes';

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
