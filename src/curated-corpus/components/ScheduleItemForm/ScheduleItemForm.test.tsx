import React from 'react';
import { DateTime } from 'luxon';
import { render, screen, waitFor } from '@testing-library/react';
import { ScheduleItemForm } from './ScheduleItemForm';
import { ProspectType, ScheduledSurface } from '../../../api/generatedTypes';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { mock_scheduledItems } from '../../integration-test-mocks/getScheduledItems';

describe('The ScheduleItemForm component', () => {
  const handleSubmit = jest.fn();

  // This is the shape of the data the form receives via the `getScheduledSurfacesForUser` query
  const scheduledSurfaces: ScheduledSurface[] = [
    {
      name: 'en-US',
      guid: 'NEW_TAB_EN_US',
      ianaTimezone: 'America/New_York',
      prospectTypes: [
        ProspectType.Timespent,
        ProspectType.TopSaved,
        ProspectType.PublisherSubmitted,
      ],
    },
    {
      name: 'de-DE',
      guid: 'NEW_TAB_DE_DE',
      ianaTimezone: 'Europe/Berlin',
      prospectTypes: [ProspectType.TopSaved],
    },
  ];

  it('renders successfully', () => {
    render(
      <ScheduleItemForm
        handleDateChange={jest.fn()}
        selectedDate={DateTime.local()}
        onSubmit={handleSubmit}
        scheduledSurfaces={scheduledSurfaces}
        approvedItemExternalId={'123abc'}
      />,
    );

    // there is at least a form and nothing falls over
    const form = screen.getByRole('form');
    expect(form).toBeVisible();
  });

  it('has three buttons and an accordion widget', () => {
    render(
      <ScheduleItemForm
        handleDateChange={jest.fn()}
        selectedDate={DateTime.local()}
        onSubmit={handleSubmit}
        scheduledSurfaces={scheduledSurfaces}
        approvedItemExternalId={'123abc'}
      />,
    );

    const buttons = screen.getAllByRole('button');
    // "Save" and "Cancel" buttons, plus the "DatePicker"
    // button in the far right of the date picker field
    // Plus the accordion element (that expands to show topic & publisher
    // distribution), part of which is also a button...
    expect(buttons).toHaveLength(4);
  });

  it('does not pre-select a scheduled surface if none was passed in and the user has access to many', () => {
    render(
      <ScheduleItemForm
        data-testId="surface-selector"
        handleDateChange={jest.fn()}
        selectedDate={DateTime.local()}
        onSubmit={handleSubmit}
        scheduledSurfaces={scheduledSurfaces}
        approvedItemExternalId={'123abc'}
      />,
    );

    const select = screen.getByLabelText(
      'Choose a Scheduled Surface',
    ) as HTMLSelectElement;

    // there should be an empty option and a single scheduled surface option
    expect(select.options.length).toEqual(scheduledSurfaces.length + 1);

    // the empty option should be selected
    expect(select.options[0].selected).toBeTruthy();
  });

  it('pre-selects the passed in scheduled surface', () => {
    render(
      <MockedProvider>
        <ScheduleItemForm
          data-testId="surface-selector"
          handleDateChange={jest.fn()}
          selectedDate={DateTime.local()}
          onSubmit={handleSubmit}
          scheduledSurfaces={scheduledSurfaces}
          scheduledSurfaceGuid="NEW_TAB_EN_US"
          approvedItemExternalId={'123abc'}
        />
      </MockedProvider>,
    );

    const select = screen.getByLabelText(
      'Choose a Scheduled Surface',
    ) as HTMLSelectElement;

    // there should be an empty option and a single scheduled surface option
    expect(select.options.length).toEqual(scheduledSurfaces.length + 1);

    // the `NEW_TAB_EN_US` option should be selected
    expect(select.options[1].selected).toBeTruthy();
    expect(select.options[1].value).toEqual('NEW_TAB_EN_US');
  });

  it('pre-selects the only available scheduled surface if none was specified and the user only has access to a single one', () => {
    render(
      <MockedProvider>
        <ScheduleItemForm
          data-testId="surface-selector"
          handleDateChange={jest.fn()}
          selectedDate={DateTime.local()}
          onSubmit={handleSubmit}
          scheduledSurfaces={[scheduledSurfaces[0]]}
          approvedItemExternalId={'123abc'}
        />
      </MockedProvider>,
    );

    const select = screen.getByLabelText(
      'Choose a Scheduled Surface',
    ) as HTMLSelectElement;

    // there should be an empty option and a single scheduled surface option
    expect(select.options.length).toEqual(2);

    // the scheduled surface should be selected
    expect(select.options[1].selected).toBeTruthy();
  });

  it('does not show manual scheduling reasons by default', async () => {
    render(
      <MockedProvider>
        <ScheduleItemForm
          data-testId="surface-selector"
          handleDateChange={jest.fn()}
          selectedDate={DateTime.local()}
          onSubmit={handleSubmit}
          scheduledSurfaces={[scheduledSurfaces[0]]}
          approvedItemExternalId={'123abc'}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      // Should there be a pre-defined reason? No
      expect(screen.queryByLabelText('Trending')).not.toBeInTheDocument();

      // Should there be a "Reason Comment" field for other reasons? No
      expect(screen.queryByLabelText('Reason Comment')).not.toBeInTheDocument();
    });
  });

  it('shows manual scheduling reasons if necessary', async () => {
    render(
      <MockedProvider>
        <ScheduleItemForm
          data-testId="surface-selector"
          handleDateChange={jest.fn()}
          selectedDate={DateTime.local()}
          onSubmit={handleSubmit}
          scheduledSurfaces={[scheduledSurfaces[0]]}
          approvedItemExternalId={'123abc'}
          showManualScheduleReasons={true}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      // Should there be a pre-defined reason? This time around, yes
      expect(screen.getByText('Evergreen')).toBeVisible();

      // Should there be a "Reason Comment" field for other reasons? Yes
      expect(screen.getByLabelText('Reason Comment')).toBeVisible();
    });
  });

  it('displays an error message if no checkboxes have been selected', async () => {
    render(
      <MockedProvider>
        <ScheduleItemForm
          data-testId="surface-selector"
          handleDateChange={jest.fn()}
          selectedDate={DateTime.local()}
          onSubmit={handleSubmit}
          scheduledSurfaces={[scheduledSurfaces[0]]}
          approvedItemExternalId={'123abc'}
          showManualScheduleReasons={true}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      userEvent.click(screen.getByText(/save/i));
    });

    const errorMessage = screen.getByText(
      /Please choose at least one reason to schedule this item manually./i,
    );
    expect(errorMessage).toBeVisible();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('expands the Topic & Publisher summary by default if requested', async () => {
    render(
      <MockedProvider mocks={[mock_scheduledItems]}>
        <ScheduleItemForm
          data-testId="surface-selector"
          handleDateChange={jest.fn()}
          selectedDate={DateTime.fromFormat('2023-01-01', 'yyyy-MM-dd')}
          onSubmit={handleSubmit}
          scheduledSurfaces={[scheduledSurfaces[0]]}
          approvedItemExternalId={'123abc'}
          showManualScheduleReasons={true}
          expandSummary={true}
        />
      </MockedProvider>,
    );

    // Wait for the summary to load, then expect to see the main headings
    // (full functionality of the summary is tested in ScheduleSummaryConnector tests,
    // we just want to make sure here it's visible to the user)
    await waitFor(() => {
      expect(screen.getByText(/Publishers/i)).toBeVisible();
      expect(screen.getByText(/Topics/i)).toBeVisible();
    });
  });

  it('does not expand the Topic & Publisher summary by default if not requested', async () => {
    render(
      <MockedProvider mocks={[mock_scheduledItems]}>
        <ScheduleItemForm
          data-testId="surface-selector"
          handleDateChange={jest.fn()}
          selectedDate={DateTime.fromFormat('2023-01-01', 'yyyy-MM-dd')}
          onSubmit={handleSubmit}
          scheduledSurfaces={[scheduledSurfaces[0]]}
          approvedItemExternalId={'123abc'}
          showManualScheduleReasons={true}
          expandSummary={false}
        />
      </MockedProvider>,
    );

    // Wait for the summary to load, then expect to see the main headings
    // (full functionality of the summary is tested in ScheduleSummaryConnector tests,
    // we just want to make sure here it's visible to the user)
    await waitFor(() => {
      expect(screen.getByText(/Publishers/i)).not.toBeVisible();
      expect(screen.getByText(/Topics/i)).not.toBeVisible();
    });
  });

  // TODO: fix the test below. possibly failing due to apollo query mocks mismatch?
  it.skip('submits the form if at least one checkbox was selected', async () => {
    render(
      // TODO: fix. This mock contains dates in the past, while the form
      // specifies today's date.
      <MockedProvider mocks={[mock_scheduledItems]}>
        <ScheduleItemForm
          data-testId="surface-selector"
          handleDateChange={jest.fn()}
          selectedDate={DateTime.local()}
          onSubmit={handleSubmit}
          scheduledSurfaces={[scheduledSurfaces[0]]}
          scheduledSurfaceGuid={scheduledSurfaces[0].guid}
          approvedItemExternalId={'123abc'}
          showManualScheduleReasons={true}
        />
      </MockedProvider>,
    );

    const chosenReason = screen.getByLabelText(/under the radar/i);

    await waitFor(() => {
      userEvent.click(chosenReason);
    });

    await waitFor(() => {
      userEvent.click(screen.getByText(/save/i));
    });

    expect(handleSubmit).toHaveBeenCalled();
  });
});
