import * as yup from 'yup';
import { DateTime } from 'luxon';
import {
  ManualScheduleReason,
  ScheduledSurface,
} from '../../../api/generatedTypes';

/**
 * Generate the validation schema with the given Scheduled Surfaces
 * that come from the `getScheduledSurfacesForUser` query.
 *
 * @param scheduledSurfaces
 * @param showManualScheduleReasons
 */
export const getValidationSchema = (
  scheduledSurfaces: ScheduledSurface[],
  showManualScheduleReasons = false,
) => {
  const accessibleScheduledSurfaces = scheduledSurfaces.map(
    (surface: ScheduledSurface) => {
      return surface.guid;
    },
  );

  return yup
    .object({
      // This is a hidden field that we pass along
      approvedItemExternalId: yup.string().trim().required(),

      scheduledSurfaceGuid: yup
        .string()
        .oneOf(accessibleScheduledSurfaces)
        .trim()
        .required('Please choose a Scheduled Surface.'),

      scheduledDate: yup
        .date()
        .min(
          // Rewind back to the start of the day locally so that curators
          // are not unintentionally prevented from scheduling stories
          // for the current date.
          DateTime.local().startOf('day'),
          'Stories cannot be scheduled in the past.',
        )
        .max(
          DateTime.local().plus({ days: 60 }),
          'Please choose a date no more than 60 days in advance.',
        )
        .required('This field is required.')
        .nullable(),

      [ManualScheduleReason.Evergreen]: yup.boolean(),
      [ManualScheduleReason.FormatDiversity]: yup.boolean(),
      [ManualScheduleReason.PublisherDiversity]: yup.boolean(),
      [ManualScheduleReason.TimeSensitiveExplainer]: yup.boolean(),
      [ManualScheduleReason.TimeSensitiveNews]: yup.boolean(),
      [ManualScheduleReason.TopicDiversity]: yup.boolean(),
      [ManualScheduleReason.Trending]: yup.boolean(),
      [ManualScheduleReason.UnderTheRadar]: yup.boolean(),
      ['OTHER']: yup.boolean(),

      reasonComment: yup
        .string()
        .max(100, 'Reason is too long, cannot exceed 100 characters.'), // max 100 chars for now
    })
    .test('manualScheduleReason', '', (obj) => {
      // Only ever validate these fields if they are shown to the user
      // Currently this is limited to manually scheduling items onto the EN_US New Tab surface.
      if (showManualScheduleReasons) {
        // If the "Other" checkbox was selected but no reason entered, fail validation
        if (obj['OTHER'] && obj['reasonComment'] === undefined) {
          return new yup.ValidationError(
            'Please provide a comment for scheduling this item manually.',
            null,
            'reasonComment',
          );
        }
        // If the "Other" checkbox was NOT selected but a reason was entered, fail validation
        if (!obj['OTHER'] && obj['reasonComment']) {
          return new yup.ValidationError(
            'Please select the "OTHER" reason checkbox.',
            null,
            'manualScheduleReason',
          );
        }
        // If at least one checkbox was selected & above conditions satisfied, pass validation
        if (
          obj[ManualScheduleReason.Evergreen] ||
          obj[ManualScheduleReason.FormatDiversity] ||
          obj[ManualScheduleReason.PublisherDiversity] ||
          obj[ManualScheduleReason.TimeSensitiveExplainer] ||
          obj[ManualScheduleReason.TimeSensitiveNews] ||
          obj[ManualScheduleReason.TopicDiversity] ||
          obj[ManualScheduleReason.Trending] ||
          obj[ManualScheduleReason.UnderTheRadar] ||
          (obj['OTHER'] && obj['reasonComment'])
        ) {
          return true;
        }

        return new yup.ValidationError(
          'Please choose at least one reason to schedule this item manually.',
          null,
          'manualScheduleReason',
        );
      } else {
        return true;
      }
    });
};
