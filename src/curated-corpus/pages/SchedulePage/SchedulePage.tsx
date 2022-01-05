import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { DateTime } from 'luxon';
import { ApolloError } from '@apollo/client';
import { FormikHelpers, FormikValues } from 'formik';
import { HandleApiResponse } from '../../../_shared/components';
import {
  LoadExtraButton,
  RemoveItemFromNewTabModal,
  ScheduledItemCardWrapper,
  SplitButton,
} from '../../components';
import {
  ScheduledCuratedCorpusItem,
  ScheduledCuratedCorpusItemsFilterInput,
  ScheduledCuratedCorpusItemsResult,
  useDeleteScheduledItemMutation,
  useGetNewTabsForUserQuery,
  useGetScheduledItemsQuery,
} from '../../api/curated-corpus-api/generatedTypes';
import {
  useNotifications,
  useRunMutation,
  useToggle,
} from '../../../_shared/hooks';
import { useStyles } from './SchedulePage.styles';
import { DropdownOption } from '../../helpers/definitions';

export const SchedulePage: React.FC = (): JSX.Element => {
  const { showNotification } = useNotifications();
  const classes = useStyles();

  // set up initial start/end dates for the query
  const [startDate, setStartDate] = useState<DateTime>(DateTime.local());
  const [endDate, setEndDate] = useState<DateTime>(
    DateTime.local().plus({ days: 1 })
  );

  // set up the initial new tab guid value (nothing at this point)
  const [currentNewTabGuid, setCurrentNewTabGuid] = useState('');

  // Why not set up the options we'll feed to the New Tab dropdown as well
  // at the same time?
  const [newTabOptions, setNewTabOptions] = useState<DropdownOption[]>([]);

  // Get the list of New Tabs the currently logged-in user has access to.
  const { data: newTabData } = useGetNewTabsForUserQuery();

  // Once the data is ready, populate the values for current New Tab Guid
  // and the dropdown options.
  useEffect(() => {
    if (newTabData) {
      const options = newTabData.getNewTabsForUser.map((newTab) => {
        return { code: newTab.guid, name: newTab.name };
      });
      setCurrentNewTabGuid(options[0].code);
      setNewTabOptions(options);
    }
  }, [newTabData]);

  /**
   * When the user selects another New Tab from the "I am curating for..." dropdown,
   * refetch all the data on the page for that New Tab.
   */
  const updateNewTab = (option: DropdownOption) => {
    refetch({
      filters: {
        newTabGuid: option.code,
        startDate: startDate.toFormat('yyyy-MM-dd'),
        endDate: endDate.toFormat('yyyy-MM-dd'),
      },
    });
    setCurrentNewTabGuid(option.code);
  };

  // By default, load today and tomorrow's items that are already scheduled
  // for this New Tab
  const { loading, error, data, fetchMore, refetch } =
    useGetScheduledItemsQuery({
      notifyOnNetworkStatusChange: true,
      variables: {
        filters: {
          newTabGuid: currentNewTabGuid,
          startDate: startDate.toFormat('yyyy-MM-dd'),
          endDate: endDate.toFormat('yyyy-MM-dd'),
        },
      },
    });

  /**
   * Load two more days' worth of data in the direction indicated
   *
   * @param direction
   */
  const loadMore = (direction: 'past' | 'future') => {
    let filters: ScheduledCuratedCorpusItemsFilterInput;

    if (direction === 'future') {
      // shift the dates two days into the future
      filters = {
        newTabGuid: currentNewTabGuid,
        startDate: startDate.plus({ days: 2 }).toFormat('yyyy-MM-dd'),
        endDate: endDate.plus({ days: 2 }).toFormat('yyyy-MM-dd'),
      };
    } else {
      // shift the dates two days into the past
      filters = {
        newTabGuid: currentNewTabGuid,
        startDate: startDate.minus({ days: 2 }).toFormat('yyyy-MM-dd'),
        endDate: endDate.minus({ days: 2 }).toFormat('yyyy-MM-dd'),
      };
    }
    fetchMore({
      variables: filters,
    })
      .then(() => {
        // Update the state variables as they will be used to calculate the dates
        // for the next fetchMore() request.
        if (direction === 'future') {
          setStartDate(startDate.plus({ days: 2 }));
          setEndDate(endDate.plus({ days: 2 }));
        } else {
          setStartDate(startDate.minus({ days: 2 }));
          setEndDate(startDate.minus({ days: 2 }));
        }
      })
      .catch((error: ApolloError) => {
        // Show an error in a toast message, if any
        showNotification(error.message, 'error');
      });
  };

  /**
   * Keep track of whether the "Remove this item" modal is open or not.
   */
  const [removeModalOpen, toggleRemoveModal] = useToggle(false);

  /**
   * Set the current Scheduled Item to be worked on.
   */
  const [currentItem, setCurrentItem] = useState<
    Omit<ScheduledCuratedCorpusItem, '__typename'> | undefined
  >(undefined);

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // Prepare the "delete scheduled item" mutation
  const [deleteScheduledItem] = useDeleteScheduledItemMutation();

  /**
   * Remove item from New Tab Schedule.
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

  return (
    <>
      <h1>Schedule</h1>

      {currentItem && (
        <RemoveItemFromNewTabModal
          item={currentItem}
          isOpen={removeModalOpen}
          onSave={onRemoveSave}
          toggleModal={toggleRemoveModal}
        />
      )}

      {newTabOptions.length > 0 && (
        <Box mb={3}>
          View schedule for:
          <SplitButton
            onMenuOptionClick={updateNewTab}
            options={newTabOptions}
            size="small"
          />
        </Box>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {!data && <HandleApiResponse loading={loading} error={error} />}

          {data && (
            <LoadExtraButton
              arrowDirection="up"
              label="Show Previous"
              onClick={() => {
                loadMore('past');
              }}
            />
          )}

          {data &&
            data.getScheduledCuratedCorpusItems.map(
              (data: ScheduledCuratedCorpusItemsResult) => (
                <Grid
                  container
                  direction="row"
                  alignItems="stretch"
                  justifyContent="flex-start"
                  spacing={3}
                  key={data.scheduledDate}
                >
                  <>
                    <Grid item xs={12}>
                      <Typography className={classes.heading} variant="h2">
                        {DateTime.fromFormat(data.scheduledDate, 'yyyy-MM-dd')
                          .setLocale('en')
                          .toLocaleString(DateTime.DATE_FULL)}{' '}
                        ({data.syndicatedCount}/{data.totalCount} syndicated)
                      </Typography>
                    </Grid>
                    {data.items.map((item: ScheduledCuratedCorpusItem) => {
                      return (
                        <ScheduledItemCardWrapper
                          key={item.externalId}
                          item={item}
                          onRemove={() => {
                            setCurrentItem(item);
                            toggleRemoveModal();
                          }}
                        />
                      );
                    })}
                  </>
                </Grid>
              )
            )}

          {data && (
            <LoadExtraButton
              arrowDirection="down"
              label="Show Next"
              onClick={() => {
                loadMore('future');
              }}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};
