import React from 'react';
import { render, screen } from '@testing-library/react';

import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { StoryItemListCard } from './StoryItemListCard';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';
import { getTestApprovedItem } from '../../helpers/approvedItem';
import { CardAction, CardActionButtonRow } from '../../../_shared/components';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';

describe('The StoryItemListCard component', () => {
  let item: ApprovedCorpusItem = getTestApprovedItem();
  const currentScheduledDate = '2024-01-20';

  const cardActionButtonsLeft: CardAction[] = [
    {
      actionName: 'Reject',
      icon: <DeleteOutlinedIcon />,
      onClick: () => jest.fn(),
    },
    {
      actionName: 'Move to bottom',
      icon: <KeyboardDoubleArrowDownOutlinedIcon />,
      onClick: () => jest.fn(),
    },
    {
      actionName: 'Edit',
      icon: <EditOutlinedIcon />,
      onClick: () => jest.fn(),
    },
    {
      actionName: 'Re-schedule',
      icon: <ScheduleIcon />,
      onClick: () => jest.fn(),
    },
  ];
  const cardActionButtonsRight: CardAction[] = [
    {
      actionName: 'Unschedule',
      icon: <EventBusyOutlinedIcon />,
      onClick: () => jest.fn(),
    },
  ];

  it('shows basic story item information with all optional card actions', () => {
    render(
      <StoryItemListCard
        isMlScheduled={false}
        item={item}
        cardActionButtonRow={
          <CardActionButtonRow
            cardActionButtonsLeft={cardActionButtonsLeft}
            cardActionButtonsRight={cardActionButtonsRight}
          />
        }
        currentScheduledDate={currentScheduledDate}
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
      <StoryItemListCard
        isMlScheduled={false}
        item={item}
        cardActionButtonRow={
          <CardActionButtonRow
            cardActionButtonsLeft={cardActionButtonsLeft}
            cardActionButtonsRight={cardActionButtonsRight}
          />
        }
        currentScheduledDate={currentScheduledDate}
        scheduledSurfaceGuid="NEW_TAB_EN_US"
      />,
    );

    expect(screen.getByText(item.excerpt)).toBeInTheDocument();
  });

  it('should show multiple authors as a comma-separated string', () => {
    render(
      <StoryItemListCard
        isMlScheduled={false}
        item={item}
        currentScheduledDate={currentScheduledDate}
        cardActionButtonRow={
          <CardActionButtonRow
            cardActionButtonsLeft={cardActionButtonsLeft}
            cardActionButtonsRight={cardActionButtonsRight}
          />
        }
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
      <StoryItemListCard
        isMlScheduled={false}
        item={item}
        currentScheduledDate={currentScheduledDate}
        cardActionButtonRow={
          <CardActionButtonRow
            cardActionButtonsLeft={cardActionButtonsLeft}
            cardActionButtonsRight={cardActionButtonsRight}
          />
        }
        scheduledSurfaceGuid="NEW_TAB_EN_US"
      />,
    );

    expect(screen.getByText('Agatha Christie')).toBeInTheDocument();
  });

  // TODO implement once we have publicationDate property on a corpus item in the corpus DB
  it.todo('should render publication date next to author and publisher');
});
