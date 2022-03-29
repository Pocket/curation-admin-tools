import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { DateTime } from 'luxon';
import { FormikHelpers, FormikValues } from 'formik';
import {
  Button,
  HandleApiResponse,
  FloatingActionButton,
} from '../../../_shared/components';
import {
  RemoveItemFromScheduledSurfaceModal,
  ScheduledItemCardWrapper,
  SplitButton,
  ScheduleItemModal,
} from '../../components';
import {
  ScheduledCuratedCorpusItem,
  ScheduledCuratedCorpusItemsResult,
  useDeleteScheduledItemMutation,
  useGetScheduledItemsLazyQuery,
  useGetScheduledSurfacesForUserQuery,
  useRescheduleScheduledCuratedCorpusItemMutation,
} from '../../../api/generatedTypes';
import {
  useNotifications,
  useRunMutation,
  useToggle,
} from '../../../_shared/hooks';
import { useStyles } from './SchedulePage.styles';
import { DropdownOption } from '../../helpers/definitions';
import { DatePicker } from '@material-ui/pickers';
import { getLocalDateTimeForGuid } from '../../helpers/helperFunctions';

export const SchedulePage: React.FC = (): JSX.Element => {
  const classes = useStyles();

  /**
   * ##########
   * ########## State variables start here
   * ##########
   */

  // set up initial start date. Note it is set a day after current local time
  const [startDate, setStartDate] = useState<DateTime>(
    DateTime.local().plus({ days: 1 })
  );

  // set up initial end date. Note it is set a day after startDate state variable
  const [endDate, setEndDate] = useState<DateTime>(
    DateTime.local().plus({ days: 2 })
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
    Omit<ScheduledCuratedCorpusItem, '__typename'> | undefined
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

  // Get the list of Scheduled Surfaces the currently logged-in user has access to.
  const { data: scheduledSurfaceData } = useGetScheduledSurfacesForUserQuery();

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // Prepare the "delete scheduled item" mutation
  const [deleteScheduledItem] = useDeleteScheduledItemMutation();

  // Prepare the "reschedule scheduled curated corpus item" mutation
  const [rescheduleItem] = useRescheduleScheduledCuratedCorpusItemMutation();

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
        }
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
    executeGetScheduledItemsQuery(
      currentScheduledSurfaceGuid,
      startDate,
      endDate
    );

    error && showNotification(error.message, 'error');

    setGuidLocalDateTime(getLocalDateTimeForGuid(currentScheduledSurfaceGuid));
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

      getLocalDateTimeForGuid(option.code);
      setGuidLocalDateTime(getLocalDateTimeForGuid(option.code));
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
    formikHelpers: FormikHelpers<any>
  ): void => {
    // Set out all the variables we need to pass to the mutation
    const variables = {
      externalId: currentItem?.externalId,
      scheduledDate: values.scheduledDate.toISODate(),
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
      refetch
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
    formikHelpers: FormikHelpers<any>
  ): void => {
    // Set out all the variables we need to pass to the mutation
    const variables = {
      externalId: currentItem?.externalId,
    };

    // Run the mutation
    runMutation(
      deleteScheduledItem,
      { variables },
      `Item removed successfully.`,
      () => {
        toggleRemoveModal();
        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      },
      refetch
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
    endDate: DateTime
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

  /**
   *
   * @param data
   * @returns Formatted day and syndicated count heading
   */
  const getDayAndSyndicatedCountHeading = (
    data: ScheduledCuratedCorpusItemsResult
  ): string => {
    return DateTime.fromFormat(data.scheduledDate, 'yyyy-MM-dd')
      .setLocale('en')
      .toLocaleString(DateTime.DATE_FULL)
      .concat(` (${data.syndicatedCount}/${data.totalCount} syndicated)`);
  };

  return (
    <>
      <h1>Schedule</h1>

      {currentItem && (
        <RemoveItemFromScheduledSurfaceModal
          item={currentItem}
          isOpen={removeModalOpen}
          onSave={onRemoveSave}
          toggleModal={toggleRemoveModal}
        />
      )}

      {currentItem && (
        <ScheduleItemModal
          approvedItem={currentItem.approvedItem}
          headingCopy={'Reschedule Item'}
          isOpen={scheduleItemModalOpen}
          toggleModal={toggleScheduleItemModal}
          onSave={onRescheduleItem}
          scheduledSurfaceGuid={currentScheduledSurfaceGuid}
        />
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
            <Grid>
              <Typography variant="h6">{guidLocalDateTime}</Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <DatePicker
                  variant="inline"
                  inputVariant="outlined"
                  format="MMMM d, yyyy"
                  margin="none"
                  id="scheduled-start-date"
                  label="Start date"
                  value={startDate}
                  onChange={(date) => {
                    date && setStartDate(date);
                  }}
                  initialFocusedDate={startDate}
                  disableToolbar
                  autoOk
                  showTodayButton
                />
              </Grid>
              <Grid item>
                <DatePicker
                  variant="inline"
                  inputVariant="outlined"
                  format="MMMM d, yyyy"
                  margin="none"
                  id="scheduled-end-date"
                  label="End date"
                  value={endDate}
                  onChange={(date) => {
                    date && setEndDate(date);
                  }}
                  initialFocusedDate={endDate}
                  maxDate={startDate.plus({ days: 30 })}
                  minDate={startDate.plus({ days: 1 })}
                  disableToolbar
                  autoOk
                />
              </Grid>
              <Grid item alignContent="center">
                <Button
                  buttonType="positive"
                  fullWidth
                  onClick={() => {
                    executeGetScheduledItemsQuery(
                      currentScheduledSurfaceGuid,
                      startDate,
                      endDate
                    );
                  }}
                >
                  Get schedule
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {/** Page Contents Below */}

      <Grid container>
        <Grid item xs={12}>
          {!data && <HandleApiResponse loading={loading} error={error} />}

          {data &&
            data.getScheduledCuratedCorpusItems.map(
              (data: ScheduledCuratedCorpusItemsResult) => (
                <Grid
                  container
                  alignItems="stretch"
                  spacing={3}
                  justifyContent="flex-start"
                  key={data.scheduledDate}
                >
                  <Grid item xs={12}>
                    <Grid container justifyContent="center">
                      <Grid item>
                        <Typography className={classes.heading} variant="h2">
                          {getDayAndSyndicatedCountHeading(data)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      {data.items.map((item: ScheduledCuratedCorpusItem) => {
                        return (
                          <ScheduledItemCardWrapper
                            key={item.externalId}
                            item={item}
                            onRemove={() => {
                              setCurrentItem(item);
                              toggleRemoveModal();
                            }}
                            onReschedule={() => {
                              setCurrentItem(item);
                              toggleScheduleItemModal();
                            }}
                            showLanguageIcon={false}
                            showRecommendedOverlay={false}
                          />
                        );
                      })}
                    </Grid>
                  </Grid>
                </Grid>
              )
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
