import React from 'react';
import { render, screen } from '@testing-library/react';

import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { SuggestedScheduleItemListCard } from './SuggestedScheduleItemListCard';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';
import { getTestApprovedItem } from '../../helpers/approvedItem';

describe('The SuggestedScheduleItemListCard component', () => {
  let item: ApprovedCorpusItem = getTestApprovedItem();
  const currentScheduledDate = '2024-01-20';

  const onMoveToBottom = jest.fn();
  const onEdit = jest.fn();
  const onReschedule = jest.fn();
  const onUnschedule = jest.fn();
  const onReject = jest.fn();

  it('shows basic scheduled item information', () => {
    render(
      <SuggestedScheduleItemListCard
        isMlScheduled={false}
        item={item}
        currentScheduledDate={currentScheduledDate}
        onEdit={onEdit}
        onUnschedule={onUnschedule}
        onReschedule={onReschedule}
        onMoveToBottom={onMoveToBottom}
        onReject={onReject}
        scheduledSurfaceGuid="NEW_TAB_EN_US"
      />,
    );

    // The image is present and the alt text is the item title
    const image = screen.getByAltText(item.title);
    expect(image).toBeInTheDocument();

    // The link to the approved item page is present and is well-formed
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining(item.url));
    // The link also opens in a new tab
    expect(link).toHaveAttribute('target', expect.stringContaining('_blank'));

    // The excerpt is also present
    const excerpt = screen.getByText(/wanted to know about react/i);
    expect(excerpt).toBeInTheDocument();
  });

  it('should render excerpt', () => {
    render(
      <SuggestedScheduleItemListCard
        isMlScheduled={false}
        item={item}
        currentScheduledDate={currentScheduledDate}
        onEdit={onEdit}
        onUnschedule={onUnschedule}
        onReschedule={onReschedule}
        onMoveToBottom={onMoveToBottom}
        onReject={onReject}
        scheduledSurfaceGuid="NEW_TAB_EN_US"
      />,
    );

    expect(screen.getByText(item.excerpt)).toBeInTheDocument();
  });

  it('should show multiple authors as a comma-separated string', () => {
    render(
      <SuggestedScheduleItemListCard
        isMlScheduled={false}
        item={item}
        currentScheduledDate={currentScheduledDate}
        onEdit={onEdit}
        onUnschedule={onUnschedule}
        onReschedule={onReschedule}
        onMoveToBottom={onMoveToBottom}
        onReject={onReject}
        scheduledSurfaceGuid="NEW_TAB_EN_US"
      />,
    );

    expect(screen.getByText(flattenAuthors(item.authors))).toBeInTheDocument();
  });

  it('should show a single author correctly', () => {
    item = {
      ...item,
      authors: [{ name: 'Agatha Christie', sortOrder: 1 }],
    };

    render(
      <SuggestedScheduleItemListCard
        isMlScheduled={false}
        item={item}
        currentScheduledDate={currentScheduledDate}
        onEdit={onEdit}
        onUnschedule={onUnschedule}
        onReschedule={onReschedule}
        onMoveToBottom={onMoveToBottom}
        onReject={onReject}
        scheduledSurfaceGuid="NEW_TAB_EN_US"
      />,
    );

    expect(screen.getByText('Agatha Christie')).toBeInTheDocument();
  });

  // TODO implement once we have publicationDate property on a corpus item in the corpus DB
  it.todo('should render publication date next to author and publisher');
});
