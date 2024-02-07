import React from 'react';
import { render, screen } from '@testing-library/react';

import { Prospect, ProspectType } from '../../../api/generatedTypes';
import { ScheduledSurfaces } from '../../helpers/definitions';
import { RemoveItemModal } from './RemoveItemModal';

describe('The RemoveItemModal component', () => {
  // test for prospect item
  const prospect: Prospect = {
    id: 'test-id',
    prospectId: 'test-prospect-id',
    prospectType: ProspectType.SlateScheduler,
    scheduledSurfaceGuid: ScheduledSurfaces[0].guid,
    url: 'www.test-prospect-url.com',
    title: 'test-title',
  };
  const toggleModal = jest.fn();
  const onSave = jest.fn();

  it('should render successfully', () => {
    render(
      <RemoveItemModal
        itemTitle={prospect.title as string}
        isOpen={true}
        onSave={onSave}
        toggleModal={toggleModal}
      />
    );

    // fetch the modal's heading and assert it renders successfully
    expect(screen.getByText(/remove this item/i)).toBeInTheDocument();
    // check for the prospect title
    const prospectTitle = screen.getByText(/test-title/i);
    expect(prospectTitle).toBeInTheDocument();
  });
});
