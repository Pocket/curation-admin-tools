import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import LuxonUtils from '@date-io/luxon';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DateTime } from 'luxon';
import { SidebarWrapper } from '../../components';
import { mock_scheduledItems } from '../../integration-test-mocks/getScheduledItems';

describe('The SidebarWrapper component', () => {
  let mocks: MockedResponse[] = [];
  let date: DateTime;

  beforeEach(() => {
    mocks = [mock_scheduledItems];
    date = DateTime.fromFormat('2023-01-01', 'yyyy-MM-dd');
  });

  it('should show sidebar heading', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <MuiPickersUtilsProvider utils={LuxonUtils}>
          <SidebarWrapper
            date={date}
            scheduledSurfaceGuid={'NEW_TAB_EN_US'}
            refreshData={false}
            setRefreshData={jest.fn()}
            setSidebarDate={jest.fn()}
          ></SidebarWrapper>
        </MuiPickersUtilsProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      // Shows correct heading with formatted display date
      expect(
        // Regex because this phrase takes up two lines in the DOM
        // with extra whitespace/line break
        screen.getByText(/scheduled for[\s\n]+?january 1, 2023/i)
      ).toBeInTheDocument();
    });
  });

  it('should show the date picker', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <MuiPickersUtilsProvider utils={LuxonUtils}>
          <SidebarWrapper
            date={date}
            scheduledSurfaceGuid={'NEW_TAB_EN_US'}
            refreshData={false}
            setRefreshData={jest.fn()}
            setSidebarDate={jest.fn()}
          ></SidebarWrapper>
        </MuiPickersUtilsProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      const datePicker = screen.getByLabelText(
        /choose a different date/i
      ) as HTMLInputElement;

      expect(datePicker).toBeInTheDocument();
      expect(datePicker.value).toMatch(/january 1, 2023/i);
    });
  });

  it('should show the schedule summary', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <MuiPickersUtilsProvider utils={LuxonUtils}>
          <SidebarWrapper
            date={date}
            scheduledSurfaceGuid={'NEW_TAB_EN_US'}
            refreshData={false}
            setRefreshData={jest.fn()}
            setSidebarDate={jest.fn()}
          ></SidebarWrapper>
        </MuiPickersUtilsProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Publishers')).toBeInTheDocument();
      expect(screen.getByText('Topics')).toBeInTheDocument();
    });
  });

  // Yet to work out how to successfully click on a date in the date picker!!!
  // Same issue as in ScheduleItemFormConnector - once it is worked out there,
  // the same strategy can be applied here.
  it.todo('should update data on choosing another date');
});
