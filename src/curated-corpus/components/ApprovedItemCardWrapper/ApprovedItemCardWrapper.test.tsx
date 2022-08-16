import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { ApprovedItemCardWrapper } from './ApprovedItemCardWrapper';
import { getTestApprovedItem } from '../../helpers/approvedItem';

describe('The ApprovedItemCardWrapper component', () => {
  const item: ApprovedCorpusItem = getTestApprovedItem();

  it('should render an approved item card', () => {
    render(
      <MemoryRouter>
        <ApprovedItemCardWrapper
          item={item}
          onEdit={jest.fn()}
          onReject={jest.fn()}
          onSchedule={jest.fn()}
        />
      </MemoryRouter>
    );

    // Only check the title here as the rest is thoroughly tested
    // in the ApprovedItemCard itself.
    const title = screen.getByText(item.title);
    expect(title).toBeInTheDocument();
  });

  it('should render action buttons', () => {
    render(
      <MemoryRouter>
        <ApprovedItemCardWrapper
          item={item}
          onEdit={jest.fn()}
          onReject={jest.fn()}
          onSchedule={jest.fn()}
        />
      </MemoryRouter>
    );

    const viewButton = screen.getByRole('button', { name: /View/i });

    const scheduleButton = screen.getByRole('button', {
      name: /Schedule/i,
    });
    const rejectButton = screen.getByRole('button', {
      name: /Reject/i,
    });
    const editButton = screen.getByRole('button', {
      name: /Edit/i,
    });

    expect(viewButton).toBeInTheDocument();
    expect(scheduleButton).toBeInTheDocument();
    expect(rejectButton).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
  });
});
