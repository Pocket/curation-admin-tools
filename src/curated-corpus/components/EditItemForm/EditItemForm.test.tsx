import React from 'react';
import LuxonUtils from '@date-io/luxon';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { render, screen } from '@testing-library/react';
import { ScheduleItemForm } from './EditItemForm';
import { newTabs } from '../../helpers/definitions';

describe('The CuratedItemSearchForm component', () => {
  const handleSubmit = jest.fn();
  const newTabList = newTabs;

  it('renders successfully', () => {
    render(
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <ScheduleItemForm
          onSubmit={handleSubmit}
          newTabList={newTabList}
          approvedItemExternalId={'123abc'}
        />
      </MuiPickersUtilsProvider>
    );

    // there is at least a form and nothing falls over
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('has two buttons', () => {
    render(
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <ScheduleItemForm
          onSubmit={handleSubmit}
          newTabList={newTabList}
          approvedItemExternalId={'123abc'}
        />
      </MuiPickersUtilsProvider>
    );

    const buttons = screen.getAllByRole('button');
    // "Save" and "Cancel" buttons.
    expect(buttons).toHaveLength(2);
  });
});
