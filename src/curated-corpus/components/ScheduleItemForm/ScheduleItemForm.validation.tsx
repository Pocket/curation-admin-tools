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
      // Manual schedule reasons are no longer required - always pass validation
      return true;
    });
};
