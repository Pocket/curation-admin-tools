import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  CuratedStatus,
  ScheduledCorpusItem,
} from '../../../api/generatedTypes';
import { ScheduledItemCardWrapper } from './ScheduledItemCardWrapper';

describe('The ScheduledItemCardWrapper component', () => {
  let item: ScheduledCorpusItem;

  beforeEach(() => {
    item = {
      externalId: '456-qwerty',
      scheduledDate: '2030-01-01',
      createdAt: 1635014926,
      createdBy: 'Amy',
      updatedAt: 1635014926,
      updatedBy: 'Amy',
      approvedItem: {
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
        isTimeSensitive: false,
        createdAt: 1635014926,
        createdBy: 'Amy',
        updatedAt: 1635114926,
      },
    };
  });

  it('should render an approved item card from a scheduled item', () => {
    render(
      <MemoryRouter>
        <ScheduledItemCardWrapper
          item={item}
          onMoveToBottom={jest.fn()}
          onReschedule={jest.fn()}
          onRemove={jest.fn()}
        />
      </MemoryRouter>
    );

    // Only check the title here as the rest is thoroughly tested
    // in the ApprovedItemCard itself.
    const title = screen.getByText(item.approvedItem.title);
    expect(title).toBeInTheDocument();
  });

  it('should render remove button', () => {
    render(
      <MemoryRouter>
        <ScheduledItemCardWrapper
          item={item}
          onMoveToBottom={jest.fn()}
          onReschedule={jest.fn()}
          onRemove={jest.fn()}
        />
      </MemoryRouter>
    );

    const removeButton = screen.getByRole('button', {
      name: /Remove/i,
    });

    expect(removeButton).toBeInTheDocument();
  });

  it('should render reschedule button', () => {
    render(
      <MemoryRouter>
        <ScheduledItemCardWrapper
          item={item}
          onMoveToBottom={jest.fn()}
          onReschedule={jest.fn()}
          onRemove={jest.fn()}
        />
      </MemoryRouter>
    );

    const rescheduleButton = screen.getByRole('button', {
      name: /Reschedule/i,
    });

    expect(rescheduleButton).toBeInTheDocument();
  });

  it('should render "move to bottom" button', () => {
    render(
      <MemoryRouter>
        <ScheduledItemCardWrapper
          item={item}
          onMoveToBottom={jest.fn()}
          onReschedule={jest.fn()}
          onRemove={jest.fn()}
        />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', {
      name: /move to bottom/i,
    });

    expect(button).toBeInTheDocument();
  });
});
