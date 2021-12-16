import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  ApprovedCuratedCorpusItem,
  CuratedStatus,
} from '../../api/curated-corpus-api/generatedTypes';
import { ApprovedItemCardWrapper } from './ApprovedItemCardWrapper';

describe('The ApprovedItemCardWrapper component', () => {
  let item: ApprovedCuratedCorpusItem;

  beforeEach(() => {
    item = {
      externalId: '123-abc',
      prospectId: '123-xyz',
      title: 'How To Win Friends And Influence People with React',
      url: 'http://www.test.com/how-to',
      imageUrl: 'https://placeimg.com/640/480/people?random=494',
      excerpt:
        'Everything You Wanted to Know About React and Were Afraid To Ask',
      language: 'de',
      publisher: 'Amazing Inventions',
      topic: 'Technology',
      status: CuratedStatus.Recommendation,
      isCollection: false,
      isSyndicated: false,
      isShortLived: false,
      createdAt: 1635014926,
      createdBy: 'Amy',
      updatedAt: 1635114926,
    };
  });

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

    const scheduleButton = screen.getByRole('button', {
      name: /Schedule/i,
    });
    const rejectButton = screen.getByRole('button', {
      name: /Reject/i,
    });
    const editButton = screen.getByRole('button', {
      name: /Edit/i,
    });

    expect(scheduleButton).toBeInTheDocument();
    expect(rejectButton).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
  });
});
