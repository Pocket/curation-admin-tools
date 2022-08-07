import React from 'react';
import { render, screen } from '@testing-library/react';
import { ScheduledCorpusItem } from '../../../api/generatedTypes';
import { RemoveItemFromScheduledSurfaceModal } from './RemoveItemFromScheduledSurfaceModal';
import { getTestApprovedItem } from '../../helpers/approvedItem';
import { ScheduledSurfaces } from '../../helpers/definitions';

describe('The RemoveItemFromScheduledSurfaceModal component', () => {
  const approvedItem = getTestApprovedItem();
  const item: ScheduledCorpusItem = {
    approvedItem,
    createdAt: 1635014926,
    createdBy: 'jdoe',
    externalId: '123-test-id',
    scheduledDate: '2022-05-24',
    scheduledSurfaceGuid: ScheduledSurfaces[0].guid,
    updatedAt: 1635114926,
    updatedBy: 'jdoe',
  };
  const isOpen = true;
  const onSave = jest.fn();
  const toggleModal = jest.fn();

  it('should render this component successfully', async () => {
    render(
      <RemoveItemFromScheduledSurfaceModal
        item={item}
        isOpen={isOpen}
        onSave={onSave}
        toggleModal={toggleModal}
      />
    );

    // fetching the modal heading and asserting it renders
    expect(
      screen.getByText(/remove this item from this scheduled surface/i)
    ).toBeInTheDocument();

    // fetching the form rendered within this modal by the form's title and asserting it gets rendered
    expect(screen.getByText(item.approvedItem.title)).toBeInTheDocument();
  });
});
