import * as yup from 'yup';
import { DateTime } from 'luxon';
import { ScheduledSurface } from '../../../api/generatedTypes';

/**
 * Generate the validation schema with the given Scheduled Surfaces
 * that come from the `getScheduledSurfacesForUser` query.
 *
 * @param scheduledSurfaces
 * @param showManualScheduleReasons
 */
export const getValidationSchema = (
  scheduledSurfaces: ScheduledSurface[],
  showManualScheduleReasons = false
) => {
  const accessibleScheduledSurfaces = scheduledSurfaces.map(
    (surface: ScheduledSurface) => {
      return surface.guid;
    }
  );

  return yup.object({
    // This is a hidden field that we pass along
    approvedItemExternalId: yup.string().trim().required(),

    scheduledSurfaceGuid: yup
      .string()
      .oneOf(accessibleScheduledSurfaces)
      .trim()
      .required('Please choose a Scheduled Surface.'),

    scheduledDate: yup
      .date()
      .min(DateTime.local())
      .max(DateTime.local().plus({ days: 60 }))
      .required('Please choose a date no more than 60 days in advance.')
      .nullable(),

    manualScheduleReason,
  });
};
