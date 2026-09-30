import React from 'react';
import { render, screen } from '@testing-library/react';

import { approvedCorpusItem } from '../../helpers/approvedItem';
import { RejectItemModal } from './RejectItemModal';

describe('The RejectItemModal component', () => {
  const toggleModal = jest.fn();
  const onSave = jest.fn();

  it('should render successfully', () => {
    render(
      <RejectItemModal
        item={approvedCorpusItem}
        isOpen={true}
        onSave={onSave}
        toggleModal={toggleModal}
      />,
    );

    // fetch the modal's heading and assert it renders successfully
    expect(
      screen.getByText(
        /reject this item from inclusion in the curated corpus/i,
      ),
    ).toBeInTheDocument();
  });
});
