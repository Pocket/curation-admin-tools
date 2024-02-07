import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ScheduledCorpusItem } from '../../../api/generatedTypes';
import { RemoveItemFromScheduledSurfaceModal } from './RemoveItemFromScheduledSurfaceModal';
import { getTestApprovedItem } from '../../helpers/approvedItem';
import { ScheduledSurfaces } from '../../helpers/definitions';
import userEvent from '@testing-library/user-event';

describe('The RemoveItemFromScheduledSurfaceModal component', () => {
  const approvedItem = getTestApprovedItem();
  const germanItem: ScheduledCorpusItem = {
    approvedItem,
    createdAt: 1635014926,
    createdBy: 'jdoe',
    externalId: '123-test-id',
    scheduledDate: '2022-05-24',
    scheduledSurfaceGuid: ScheduledSurfaces[1].guid,
    updatedAt: 1635114926,
    updatedBy: 'jdoe',
  };
  const usItem: ScheduledCorpusItem = {
    approvedItem,
    createdAt: 1935014924,
    createdBy: 'klm',
    externalId: '1234-test-id',
    scheduledDate: '2022-05-24',
    scheduledSurfaceGuid: ScheduledSurfaces[0].guid,
    updatedAt: 1935114924,
    updatedBy: 'klm',
  };
  const isOpen = true;
  const onSave = jest.fn();
  const toggleModal = jest.fn();

  it('should render this component successfully for new tab en-us item', async () => {
    render(
      <RemoveItemFromScheduledSurfaceModal
        item={usItem}
        isOpen={isOpen}
        onSave={onSave}
        toggleModal={toggleModal}
      />
    );

    // fetching the modal heading and asserting it renders
    expect(
      screen.getByText(/remove this item from this scheduled surface/i)
    ).toBeInTheDocument();

    // fetch and assert the RemoveItemForm component is rendered within this component
    expect(screen.getByRole('form')).toBeInTheDocument();
    // check for the item title
    const itemTitle = screen.getByText(
      /How To Win Friends And Influence People with React/i
    );
    expect(itemTitle).toBeInTheDocument();
    // check that one of the reasons is present (this indicates that the removal reason form is rendered)
    expect(screen.getByText('Niche')).toBeInTheDocument();
  });

  it('should render this component successfully for german item', async () => {
    render(
      <RemoveItemFromScheduledSurfaceModal
        item={germanItem}
        isOpen={isOpen}
        onSave={onSave}
        toggleModal={toggleModal}
      />
    );

    // fetching the modal heading and asserting it renders
    expect(
      screen.getByText(/remove this item from this scheduled surface/i)
    ).toBeInTheDocument();

    // fetch and assert the RemoveItemFromScheduleSurfaceForm component is rendered within this component
    expect(screen.getByRole('form')).toBeInTheDocument();
    // expect the single checkbox to be present
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should call the onSave function when the checkbox is checked and "Save" form button is clicked for german item', async () => {
    render(
      <RemoveItemFromScheduledSurfaceModal
        item={germanItem}
        isOpen={isOpen}
        onSave={onSave}
        toggleModal={toggleModal}
      />
    );

    // fetch the checkbox and button elements
    const saveButton = screen.getByRole('button', { name: /save/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    const checkBox = screen.getByRole('checkbox');

    // assert all three elements were rendered
    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    expect(checkBox).toBeInTheDocument();

    // click the checkbox and the save button
    await waitFor(() => userEvent.click(checkBox));
    await waitFor(() => userEvent.click(saveButton));

    // assert that onSave callback was called
    expect(onSave).toHaveBeenCalled();
  });

  it('should not call the onSave function when the checkbox is not checked and "Save" form button is clicked for german item', async () => {
    render(
      <RemoveItemFromScheduledSurfaceModal
        item={germanItem}
        isOpen={isOpen}
        onSave={onSave}
        toggleModal={toggleModal}
      />
    );

    const errorMessage = `Yes, I want to remove ${germanItem.approvedItem.title} from this scheduled surface`;

    // fetch the button elements
    const saveButton = screen.getByRole('button', { name: /save/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    // assert all button elements were rendered
    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();

    // click the save button
    userEvent.click(saveButton);

    // assert that the error message is shown
    expect(
      await waitFor(() => screen.findByLabelText(errorMessage))
    ).toBeInTheDocument();

    // assert that onSave callback was not called
    expect(onSave).not.toHaveBeenCalled();

    // click the cancel button and assert its callback was called
    userEvent.click(cancelButton);
    expect(toggleModal).toHaveBeenCalled();
  });
});
