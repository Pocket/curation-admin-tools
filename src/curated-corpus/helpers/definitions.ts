// Lifted from Collection API - Curation Categories
// Where do we get this from/store in this tool?

export interface DropdownOption {
  code: string;
  name: string;
}

export const topics: DropdownOption[] = [
  { code: 'business', name: 'Business' },
  { code: 'career', name: 'Career' },
  { code: 'coronavirus', name: 'Coronavirus' },
  { code: 'education', name: 'Education' },
  { code: 'entertainment', name: 'Entertainment' },
  { code: 'food', name: 'Food' },
  { code: 'health-and-fitness', name: 'Health & Fitness' },
  { code: 'parenting', name: 'Parenting' },
  { code: 'personal-finance', name: 'Personal Finance' },
  { code: 'politics', name: 'Politics' },
  { code: 'science', name: 'Science' },
  { code: 'self-improvement', name: 'Self Improvement' },
  { code: 'sports', name: 'Sports' },
  { code: 'technology', name: 'Technology' },
  { code: 'travel', name: 'Travel' },
];

export const languages: DropdownOption[] = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
];
