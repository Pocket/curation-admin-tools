import React from 'react';
import { render, screen } from '@testing-library/react';

import { RemoveItemModal } from './RemoveItemModal';

describe('The RemoveItemModal component', () => {
  const toggleModal = jest.fn();
  const onSave = jest.fn();

  it('should render successfully', () => {
    render(
      <RemoveItemModal
        itemTitle="test-title"
        isOpen={true}
        onSave={onSave}
        toggleModal={toggleModal}
      />,
    );

    // fetch the modal's heading and assert it renders successfully
    expect(screen.getByText(/remove this item/i)).toBeInTheDocument();
    // check for the item title
    const itemTitle = screen.getByText(/test-title/i);
    expect(itemTitle).toBeInTheDocument();
  });
});
