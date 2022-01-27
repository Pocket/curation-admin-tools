import * as yup from 'yup';
import { DateTime } from 'luxon';
import { NewTab } from '../../api/curated-corpus-api/generatedTypes';

/**
 * Generate the validation schema with the given New Tabs
 * that come from the `getNewTabsForUser` query.
 *
 * @param newTabs
 */
export const getValidationSchema = (newTabs: NewTab[]) => {
  const newTabAllowedValues = newTabs.map((newTab: NewTab) => {
    return newTab.guid;
  });

  return yup.object({
    // This is a hidden field that we pass along
    approvedItemExternalId: yup.string().trim().required(),

    newTabGuid: yup
      .string()
      .oneOf(newTabAllowedValues)
      .trim()
      .required('Please choose a New Tab.'),

    scheduledDate: yup
      .date()
      .min(DateTime.local())
      .max(DateTime.local().plus({ days: 60 }))
      .required('Please choose a date no more than 60 days in advance.')
      .nullable(),
  });
};
