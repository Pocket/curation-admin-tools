// Here we keep sets of options for curating items
import { ShareableListModerationStatus } from '../../api/generatedTypes';

export interface DropdownOption {
  code: string;
  name: string;
}

// This maps to the status (ShareableListModerationStatus type) field in DB for an ApprovedItem
export const shareableListModerationStatusOptions: DropdownOption[] = [
  { code: ShareableListModerationStatus.Hidden, name: 'HIDDEN' },
  // we don't provide visible status for now
  // { code: ShareableListModerationStatu.Visible, name: 'VISIBLE' },
];
