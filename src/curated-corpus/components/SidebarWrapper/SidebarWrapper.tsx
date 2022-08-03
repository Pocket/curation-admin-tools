import React from 'react';
import { DateTime } from 'luxon';
import { useStyles } from './SidebarWrapper.styles';
import { ScheduleSummaryConnector } from '../ScheduleSummaryConnector/ScheduleSummaryConnector';
import { SidebarDatePicker } from '../SidebarDatePicker/SidebarDatePicker';
import { Box } from '@material-ui/core';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

interface SidebarWrapperProps {
  /**
   * The date the data should be fetched for. In Luxon's DateTime format
   */
  date: DateTime;

  /**
   * A state management function passed from the parent component that updates
   * the date.
   *
   * @param date
   */
  setSidebarDate: (date: DateTime | null) => void;

  /**
   * The scheduled surface GUID the data should be fetched for.
   */
  scheduledSurfaceGuid: string;

  /**
   * Whether to refresh the data - a manual trigger to refresh it
   * if an action happens upstream in a parent component.
   */
  refreshData: boolean;

  /**
   * A method to set the manual trigger above back to `false`
   * so it works on the next manual refresh (when it will be turned to `true`
   * again).
   *
   * @param refreshData
   */
  setRefreshData: (refreshData: boolean) => void;
}

/**
 * This component exists mainly because the contents of the sidebar
 * should stay on the screen as the user scrolls down the page.
 *
 * It's also handy to keep all this markup and some code out of
 * the ProspectingPage component.
 *
 * @param props
 * @constructor
 */
export const SidebarWrapper: React.FC<SidebarWrapperProps> = (
  props
): JSX.Element => {
  const classes = useStyles();
  const {
    date,
    setSidebarDate,
    scheduledSurfaceGuid,
    refreshData,
    setRefreshData,
  } = props;

  const displayDate = date.setLocale('en').toLocaleString(DateTime.DATE_FULL);

  // What to do when the user clicks on a date in the calendar.
  const handleDateChange = (
    date: MaterialUiPickersDate,
    value?: string | null | undefined
  ) => {
    // Keep track of the chosen date.
    setSidebarDate(date);
  };

  return (
    <div className={classes.root}>
      <h3> Scheduled for {displayDate}</h3>

      <Box mt={3} mb={1}>
        <SidebarDatePicker
          handleDateChange={handleDateChange}
          selectedDate={date}
        />
      </Box>

      <ScheduleSummaryConnector
        date={date}
        scheduledSurfaceGuid={scheduledSurfaceGuid}
        refreshData={refreshData}
        setRefreshData={setRefreshData}
      />
    </div>
  );
};
