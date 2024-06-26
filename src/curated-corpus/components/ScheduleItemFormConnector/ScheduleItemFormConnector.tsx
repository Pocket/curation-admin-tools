import React, { useState } from 'react';
import { FormikHelpers, FormikValues } from 'formik';
import { DateTime } from 'luxon';
import {
  HandleApiResponse,
  SharedFormButtonsProps,
} from '../../../_shared/components';
import { useGetScheduledSurfacesForUserQuery } from '../../../api/generatedTypes';

import { ScheduleItemForm } from '../';

interface ScheduleItemFormConnectorProps {
  /**
   * The UUID of the Approved Curated Item about to be scheduled.
   */
  approvedItemExternalId: string;

  /**
   * Use this date as the default date if it's provided.
   */
  date?: DateTime;

  /**
   * The GUID of the Scheduled Surface if one's been sent through.
   */
  scheduledSurfaceGuid?: string;

  /**
   * Whether to lock the scheduled surface dropdown to just the value sent through
   * in the `scheduledSurfaceGuid` variable.
   */
  disableScheduledSurface?: boolean;

  /**
   * Whether to show the optional manual schedule reasons.
   */
  showManualScheduleReasons?: boolean;

  /**
   * Whether to expand the Topic & Publisher summary.
   */
  expandSummary?: boolean;

  /**
   * What do we do with the submitted data?
   */
  onSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ) => void | Promise<any>;
}

export const ScheduleItemFormConnector: React.FC<
  ScheduleItemFormConnectorProps & SharedFormButtonsProps
> = (props) => {
  const {
    approvedItemExternalId,
    date,
    disableScheduledSurface,
    scheduledSurfaceGuid,
    showManualScheduleReasons,
    expandSummary,
    onCancel,
    onSubmit,
  } = props;

  // Get the list of Scheduled Surfaces the currently logged-in user has access to.
  const { data, loading, error } = useGetScheduledSurfacesForUserQuery();

  // Set the default scheduled date to tomorrow.
  // Do we need to worry about timezones here? .local() returns the date
  // in the user locale, not the UTC date.
  const tomorrow = DateTime.local().plus({ days: 1 });

  // Save the date in a state var as the submitted form will contain
  // a formatted string instead of a luxon object. Would like to work with the luxon
  // object instead of parsing the date from string.
  // Use the date provided; otherwise, use tomorrow's date in the curator's time zone

  const [selectedDate, setSelectedDate] = useState<DateTime | null>(
    date ? date : tomorrow,
  );

  // What to do when the user clicks on a date in the calendar.
  const handleDateChange = (date: any, value?: string | null | undefined) => {
    // Keep track of the chosen date.
    setSelectedDate(date);
  };

  return (
    <>
      {!data && <HandleApiResponse loading={loading} error={error} />}
      {data && (
        <ScheduleItemForm
          approvedItemExternalId={approvedItemExternalId}
          handleDateChange={handleDateChange}
          scheduledSurfaces={data?.getScheduledSurfacesForUser}
          scheduledSurfaceGuid={scheduledSurfaceGuid}
          disableScheduledSurface={disableScheduledSurface}
          showManualScheduleReasons={showManualScheduleReasons}
          expandSummary={expandSummary}
          selectedDate={selectedDate}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      )}
    </>
  );
};
