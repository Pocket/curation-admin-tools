import React, { ReactElement, useEffect, useState } from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { FormikHelpers, FormikValues } from 'formik';
import {
  Button,
  FloatingActionButton,
  HandleApiResponse,
} from '../../../_shared/components';
import {
  EditCorpusItemAction,
  RejectAndUnscheduleItemAction,
  RemoveItemFromScheduledSurfaceModal,
  ScheduleDayData,
  ScheduleItemModal,
  SplitButton,
} from '../../components';
import {
  ActionScreen,
  DeleteScheduledCorpusItemInput,
  ScheduledCorpusItem,
  ScheduledCorpusItemsResult,
  useDeleteScheduledItemMutation,
  useGetScheduledItemsLazyQuery,
  useGetScheduledSurfacesForUserQuery,
  useRescheduleScheduledCorpusItemMutation,
} from '../../../api/generatedTypes';
import {
  useNotifications,
  useRunMutation,
  useToggle,
} from '../../../_shared/hooks';
import { DropdownOption } from '../../helpers/definitions';
import { getLocalDateTimeForGuid } from '../../helpers/helperFunctions';

export const SchedulePage: React.FC = (): ReactElement => {
  /**
   * ##########
   * ########## State variables start here
   * ##########
   */

  // set up initial start date. Note it is set a day after current local time
  const [startDate, setStartDate] = useState<DateTime>(
    DateTime.local().plus({ days: 1 }),
  );

  // set up initial end date. Note it is set a day after startDate state variable
  const [endDate, setEndDate] = useState<DateTime>(
    DateTime.local().plus({ days: 2 }),
  );

  // set up the initial Scheduled Surface GUID value (nothing at this point)
  const [currentScheduledSurfaceGuid, setCurrentScheduledSurfaceGuid] =
    useState('');

  // Why not set up the options we'll feed to the Scheduled Surface dropdown as well
  // at the same time?
  const [scheduledSurfaceOptions, setScheduledSurfaceOptions] = useState<
    DropdownOption[]
  >([]);

  /**
   * Set the current Scheduled Item to be worked on.
   */
  const [currentItem, setCurrentItem] = useState<
    Omit<ScheduledCorpusItem, '__typename'> | undefined
  >(undefined);

  // State variable to store the current local time for the currently selected scheduled surface
  const [guidLocalDateTime, setGuidLocalDateTime] = useState<
    string | undefined
  >();

  /**
   * ##########
   * ########## gql and other useful hooks start here
   * ##########
   */

  // Set up the toast message hook
  const { showNotification } = useNotifications();

  /**
   * Keep track of whether the "Remove this item" modal is open or not.
   */
  const [removeModalOpen, toggleRemoveModal] = useToggle(false);

  /**
   * Keep track of whether the "Schedule Item Modal" is open or not
   */
  const [scheduleItemModalOpen, toggleScheduleItemModal] = useToggle(false);

  /**
   * Keep track of whether the "Edit item modal" is open or not
   */
  const [editItemModalOpen, toggleEditModal] = useToggle(false);

  /**
   * Keep track of whether the "Reject this item" modal is open or not.
   */
  const [rejectAndUnscheduleModalOpen, toggleRejectAndUnscheduleModal] =
    useToggle(false);

  // Get the list of Scheduled Surfaces the currently logged-in user has access to.
  const { data: scheduledSurfaceData } = useGetScheduledSurfacesForUserQuery({
    onCompleted: (data) => {
      const options = data.getScheduledSurfacesForUser.map(
        (scheduledSurface) => {
          return { code: scheduledSurface.guid, name: scheduledSurface.name };
        },
      );
      if (options.length > 0) {
        setCurrentScheduledSurfaceGuid(options[0].code);
      }
    },
  });

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // Prepare the "delete scheduled item" mutation
  const [deleteScheduledItem] = useDeleteScheduledItemMutation();

  // Prepare the "reschedule scheduled curated corpus item" mutation
  const [rescheduleItem] = useRescheduleScheduledCorpusItemMutation();

  /**
   * ##########
   * ########## useEffect and other functions start here
   * ##########
   */

  // Once the data is ready, populate the values for current Scheduled Surface GUID
  // and the dropdown options.
  useEffect(() => {
    if (scheduledSurfaceData) {
      const options = scheduledSurfaceData.getScheduledSurfacesForUser.map(
        (surface) => {
          return { code: surface.guid, name: surface.name };
        },
      );
      if (options.length > 0) {
        setCurrentScheduledSurfaceGuid(options[0].code);
        setScheduledSurfaceOptions(options);
      }
    }
  }, [scheduledSurfaceData]);

  // UseEffect hook that gets the scheduled items for the selected scheduled surface
  // has the currentScheduledSurfaceGuid as the dependency and initial execution is also on page load
  useEffect(() => {
    // check if the currentScheduledSurfaceGuid state variable is set first
    // due to non-sequential and async nature of React state updates, it causes the below query
    // to run with the incorrect value on page load intermittently
    if (currentScheduledSurfaceGuid) {
      executeGetScheduledItemsQuery(
        currentScheduledSurfaceGuid,
        startDate,
        endDate,
      );
    }

    // show error toast for above query if any
    error && showNotification(error.message, 'error');

    // set local time for the scheduled surface on initial page load
    scheduledSurfaceData &&
      setGuidLocalDateTime(
        getLocalDateTimeForGuid(
          currentScheduledSurfaceGuid,
          scheduledSurfaceData,
        ),
      );
  }, [currentScheduledSurfaceGuid]);

  // Setting up the lazy query hook now that we need to execute
  // the query function on a button click after selecting the dates
  const [getScheduledItemsQuery, { loading, error, data, refetch }] =
    useGetScheduledItemsLazyQuery({
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    });

  /**
   * When the user selects another Scheduled Surface from the "I am curating for..." dropdown,
   * refetch all the data on the page for that Scheduled Surface.
   */
  const updateScheduledSurface = (option: DropdownOption) => {
    // The "refetch" variable is only defined after the first execution
    // of a lazy query hook function
    if (refetch) {
      refetch({
        filters: {
          scheduledSurfaceGuid: option.code,
          startDate: startDate.toFormat('yyyy-MM-dd'),
          endDate: endDate.toFormat('yyyy-MM-dd'),
        },
      });
      setCurrentScheduledSurfaceGuid(option.code);

      scheduledSurfaceData &&
        setGuidLocalDateTime(
          getLocalDateTimeForGuid(option.code, scheduledSurfaceData),
        );
    }
  };

  /**
   * Reschedule item
   *
   * @param values
   * @param formikHelpers
   */
  const onRescheduleItem = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ): void => {
    // DE items migrated from the old system don't have a topic. This check forces to add a topic before scheduling
    if (!currentItem?.approvedItem.topic) {
      showNotification('Cannot schedule item without topic', 'error');
      return;
    }

    // Set out all the variables we need to pass to the mutation
    const variables = {
      externalId: currentItem?.externalId,
      scheduledDate: values.scheduledDate.toISODate(),
      source: currentItem.source,
      actionScreen: ActionScreen.Schedule,
    };

    // Run the mutation
    runMutation(
      rescheduleItem,
      { variables },
      `Item rescheduled successfully.`,
      () => {
        toggleScheduleItemModal();
        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      },
      refetch,
    );
  };

  /**
   * Remove item from Scheduled Surface.
   *
   * @param values
   * @param formikHelpers
   */
  const onRemoveSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ): void => {
    // Set up the input
    const input: DeleteScheduledCorpusItemInput = {
      externalId: currentItem?.externalId as string,
      reasonComment: values.reasonComment,
      reasons: values.removalReason,
      actionScreen: ActionScreen.Schedule,
    };
    // Run the mutation
    runMutation(
      deleteScheduledItem,
      { variables: { data: input } },
      `Item removed successfully.`,
      () => {
        toggleRemoveModal();
        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      },
      refetch,
    );
  };

  /**
   * Function that wraps the getScheduledItemsQuery function
   * @param surfaceGuid
   * @param startDate
   * @param endDate
   */
  const executeGetScheduledItemsQuery = (
    surfaceGuid: string,
    startDate: DateTime,
    endDate: DateTime,
  ) => {
    getScheduledItemsQuery({
      variables: {
        filters: {
          scheduledSurfaceGuid: surfaceGuid,
          startDate: startDate.toFormat('yyyy-MM-dd'),
          endDate: endDate.toFormat('yyyy-MM-dd'),
        },
      },
    });

    if (error) {
      showNotification(error.message, 'error');
    }
  };

  return (
    <>
      <h1>Schedule</h1>

      {currentItem && (
        <>
          <RemoveItemFromScheduledSurfaceModal
            item={currentItem}
            isOpen={removeModalOpen}
            onSave={onRemoveSave}
            toggleModal={toggleRemoveModal}
          />
          <ScheduleItemModal
            approvedItem={currentItem.approvedItem}
            headingCopy={'Reschedule Item'}
            isOpen={scheduleItemModalOpen}
            toggleModal={toggleScheduleItemModal}
            onSave={onRescheduleItem}
            scheduledSurfaceGuid={currentScheduledSurfaceGuid}
          />
          <EditCorpusItemAction
            item={currentItem.approvedItem}
            actionScreen={ActionScreen.Schedule}
            modalOpen={editItemModalOpen}
            toggleModal={toggleEditModal}
            refetch={refetch}
          />
          <RejectAndUnscheduleItemAction
            item={currentItem}
            actionScreen={ActionScreen.Schedule}
            modalOpen={rejectAndUnscheduleModalOpen}
            toggleModal={toggleRejectAndUnscheduleModal}
            refetch={refetch}
          />
        </>
      )}
      {scheduledSurfaceOptions.length > 0 && (
        <Grid container spacing={2}>
          <Grid item>
            <Grid item>
              View schedule for:
              <SplitButton
                onMenuOptionClick={updateScheduledSurface}
                options={scheduledSurfaceOptions}
                size="small"
              />
            </Grid>
            <Grid item>
              <Typography variant="h6">{guidLocalDateTime}</Typography>
            </Grid>
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <Grid container spacing={2} alignItems="center">
                <Grid item sm>
                  <DatePicker
                    label="Start date"
                    inputFormat="MMMM d, yyyy"
                    value={startDate}
                    onChange={(date) => {
                      date && setStartDate(date);
                    }}
                    openTo="day"
                    renderInput={(params: any) => (
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        id="scheduled-start-date"
                        {...params}
                      />
                    )}
                  />
                </Grid>
                <Grid item sm>
                  <DatePicker
                    label="End date"
                    inputFormat="MMMM d, yyyy"
                    value={endDate}
                    onChange={(date) => {
                      date && setEndDate(date);
                    }}
                    openTo="day"
                    maxDate={startDate.plus({ days: 365 })}
                    renderInput={(params: any) => (
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        id="scheduled-end-date"
                        {...params}
                      />
                    )}
                  />
                </Grid>
                <Grid item>
                  <Button
                    buttonType="positive"
                    fullWidth
                    onClick={() => {
                      executeGetScheduledItemsQuery(
                        currentScheduledSurfaceGuid,
                        startDate,
                        endDate,
                      );
                    }}
                  >
                    Get schedule
                  </Button>
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Grid>
        </Grid>
      )}

      {/** Page Contents Below */}

      <Grid container spacing={2}>
        {!data && (
          <Grid item xs={12}>
            <HandleApiResponse loading={loading} error={error} />
          </Grid>
        )}

        <Grid item xs={12}>
          {data &&
            data.getScheduledCorpusItems.map(
              (data: ScheduledCorpusItemsResult) => (
                <ScheduleDayData
                  key={`schedule-day-data-${data.scheduledDate}`}
                  currentScheduledSurfaceGuid={currentScheduledSurfaceGuid}
                  data={data}
                  refetch={refetch}
                  setCurrentItem={setCurrentItem}
                  toggleEditModal={toggleEditModal}
                  toggleRemoveModal={toggleRemoveModal}
                  toggleScheduleItemModal={toggleScheduleItemModal}
                  toggleRejectAndUnscheduleModal={
                    toggleRejectAndUnscheduleModal
                  }
                />
              ),
            )}
        </Grid>
        <FloatingActionButton
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </Grid>
    </>
  );
};
