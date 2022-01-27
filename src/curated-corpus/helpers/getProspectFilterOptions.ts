import { DropdownOption, prospectFilterOptions } from './definitions';
import { ProspectType } from '../../api/generatedTypes';

/**
 * This helper function takes all possible prospect filter options for the filtering
 * dropdown on the Prospecting page and cuts the list down to the ones available for
 * a given New Tab.
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
