import React from 'react';
import { render, screen } from '@testing-library/react';

import { ApprovedCorpusItem, SectionItem } from '../../../api/generatedTypes';
import { RemoveSectionItemModal } from './RemoveSectionItemModal';
import { getTestApprovedItem } from '../../helpers/approvedItem';

describe('The RemoveSectionItemModal component', () => {
  const item: ApprovedCorpusItem = getTestApprovedItem();
  const mockSectionItem: SectionItem = {
    externalId: 'item-1',
    approvedItem: item,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const toggleModal = jest.fn();
  const onSave = jest.fn();

  it('should render successfully', () => {
    render(
      <RemoveSectionItemModal
        itemTitle={mockSectionItem.approvedItem.title}
        isOpen={true}
        onSave={onSave}
        toggleModal={toggleModal}
      />,
    );

    // fetch the modal's heading and assert it renders successfully
    expect(screen.getByText(/remove this section item/i)).toBeInTheDocument();
    // check for the section item title
    const sectionItemTitle = screen.getByText(
      /How To Win Friends And Influence People with React/i,
    );
    expect(sectionItemTitle).toBeInTheDocument();
  });
});
