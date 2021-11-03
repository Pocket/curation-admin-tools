import * as yup from 'yup';
import { NewTab, newTabs } from '../../helpers/definitions';
import { DateTime } from 'luxon';

// TODO: When auth is in, this should be limited to values the user has access to.
const newTabAllowedValues = newTabs.map((newTab: NewTab) => {
  return newTab.guid;
});

export const validationSchema = yup.object({
  // This is a hidden field that we pass along
  curatedItemExternalId: yup.string().trim().required(),

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
