// Here we keep sets of options for curating items
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
  { code: 'HEALTH & FITNESS', name: 'Health & Fitness' },
  { code: 'PARENTING', name: 'Parenting' },
  { code: 'PERSONAL FINANCE', name: 'Personal Finance' },
  { code: 'POLITICS', name: 'Politics' },
  { code: 'SCIENCE', name: 'Science' },
  { code: 'SELF IMPROVEMENT', name: 'Self Improvement' },
  { code: 'SPORTS', name: 'Sports' },
  { code: 'Technology', name: 'Technology' },
  { code: 'Travel', name: 'Travel' },
];

// Language codes. Currently only English and German are needed.
export const languages: DropdownOption[] = [
  { code: 'EN', name: 'English' },
  { code: 'DE', name: 'German' },
];
