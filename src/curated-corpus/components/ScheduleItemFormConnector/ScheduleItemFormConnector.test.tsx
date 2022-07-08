import React from 'react';
import { render, screen } from '@testing-library/react';
import { ApolloProvider } from '@apollo/client';
import { SnackbarProvider } from 'notistack';
import { client } from '../../../api/client';
import { ScheduleItemFormConnector } from './ScheduleItemFormConnector';

describe('ScheduleItemFormConnector', () => {
  it('does things', () => {
    const { debug } = render(
      <ApolloProvider client={client}>
        <SnackbarProvider>
          <ScheduleItemFormConnector
            approvedItemExternalId="dummyId"
            onSubmit={jest.fn()}
          />
        </SnackbarProvider>
      </ApolloProvider>
    );

    debug();

    // TODO: test that all scheduled surfaces available for the user
    // have loaded in the dropdown
    const select = screen.getByLabelText(
      'New Tab (en-US)'
    ) as HTMLSelectElement;

    expect(select).toBeInTheDocument();
  });

  // More tests:
  // - once a scheduled surface is selected, another query is kicked off
  // to look up the number of scheduled items for that day

  // - if this query fails, user sees an error

  // - if query succeeds but there are no scheduled items for that date yet,
  // check for presence of "Nothing has been scheduled for this date yet." on the screen

  // if query succeeds and there's X number of items scheduled, look for
  // "Already scheduled: X story/stories (Y syndicated)" copy
});
