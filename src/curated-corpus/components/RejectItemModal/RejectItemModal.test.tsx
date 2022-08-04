import React from 'react';
import { render, screen } from '@testing-library/react';

import { Prospect, ProspectType } from '../../../api/generatedTypes';
import { ScheduledSurfaces } from '../../helpers/definitions';
import { RejectItemModal } from './RejectItemModal';

describe('The RejectItemModal component', () => {
  const prospect: Prospect = {
    id: 'test-id',
    prospectId: 'test-prospect-id',
    prospectType: ProspectType.Global,
    scheduledSurfaceGuid: ScheduledSurfaces[0].guid,
    url: 'www.test-prospect-url.com',
    title: 'test-title',
  };
  const toggleModal = jest.fn();
  const onSave = jest.fn();

  it('should render successfully', () => {
    render(
      <RejectItemModal
        prospect={prospect}
        isOpen={true}
        onSave={onSave}
        toggleModal={toggleModal}
      />
    );

    // fetch the modal's heading and assert it renders successfully
    expect(
      screen.getByText(/reject this item from inclusion in the curated corpus/i)
    ).toBeInTheDocument();
  });
});
