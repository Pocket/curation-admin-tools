import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CardActionButtonRow } from './CardActionButtonRow';

describe('The CardActionButtonRow component', () => {
  const onMoveToBottom = jest.fn();
  const onEdit = jest.fn();
  const onReschedule = jest.fn();
  const onUnschedule = jest.fn();
  const onReject = jest.fn();
  const onRemove = jest.fn();

  //TODO update when reject button flow ready
  it('should render all five card action buttons and call their callbacks', () => {
    render(
      <CardActionButtonRow
        onEdit={onEdit}
        onUnschedule={onUnschedule}
        onReschedule={onReschedule}
        onMoveToBottom={onMoveToBottom}
        onReject={onReject}
        onRemove={onRemove}
      />,
    );

    // assert edit button is present and calls its callback
    const editButton = screen.getByRole('button', { name: 'edit' });
    expect(editButton).toBeInTheDocument();
    userEvent.click(editButton);
    expect(onEdit).toHaveBeenCalled();

    // assert unscheduleButton button is present and calls its callback
    const unscheduleButton = screen.getByRole('button', { name: 'unschedule' });
    expect(unscheduleButton).toBeInTheDocument();
    userEvent.click(unscheduleButton);
    expect(onUnschedule).toHaveBeenCalled();

    // assert re-schedule button is present and calls its callback
    const rescheduleButton = screen.getByRole('button', {
      name: 're-schedule',
    });
    expect(rescheduleButton).toBeInTheDocument();
    userEvent.click(rescheduleButton);
    expect(onReschedule).toHaveBeenCalled();

    // assert move to bottom button is present and calls its callback
    const moveToBottomButton = screen.getByRole('button', {
      name: 'move to bottom',
    });
    expect(moveToBottomButton).toBeInTheDocument();
    userEvent.click(moveToBottomButton);
    expect(onMoveToBottom).toHaveBeenCalled();

    //assert for reject button and onReject callback
    const rejectButton = screen.getByRole('button', {
      name: 'reject',
    });
    expect(rejectButton).toBeInTheDocument();
    userEvent.click(rejectButton);
    expect(onReject).toHaveBeenCalled();

    //assert for remove button and onRemove callback
    const removeButton = screen.getByRole('button', {
      name: 'remove',
    });
    expect(removeButton).toBeInTheDocument();
    userEvent.click(rejectButton);
    expect(onReject).toHaveBeenCalled();
  });
  it('should only render card actions that are passed', () => {
    render(<CardActionButtonRow onEdit={onEdit} onReject={onReject} />);

    // assert edit button is present and calls its callback
    const editButton = screen.getByRole('button', { name: 'edit' });
    expect(editButton).toBeInTheDocument();
    userEvent.click(editButton);
    expect(onEdit).toHaveBeenCalled();

    // assert unscheduleButton button is NOT present
    const unscheduleButton = screen.queryByLabelText('unschedule');
    expect(unscheduleButton).not.toBeInTheDocument();

    // assert re-schedule button is NOT present
    const rescheduleButton = screen.queryByLabelText('re-schedule');
    expect(rescheduleButton).not.toBeInTheDocument();

    // assert move to bottom button is is NOT present
    const moveToBottomButton = screen.queryByLabelText('move to bottom');
    expect(moveToBottomButton).not.toBeInTheDocument();

    //assert for reject button and onReject callback
    const rejectButton = screen.getByRole('button', {
      name: 'reject',
    });
    expect(rejectButton).toBeInTheDocument();
    userEvent.click(rejectButton);
    expect(onReject).toHaveBeenCalled();

    // assert removeButton button is NOT present
    const removeButton = screen.queryByLabelText('remove');
    expect(removeButton).not.toBeInTheDocument();
  });
});
