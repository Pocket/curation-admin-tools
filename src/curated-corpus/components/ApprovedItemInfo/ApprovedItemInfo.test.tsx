import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  ApprovedCorpusItem,
  CorpusLanguage,
  Topics,
} from '../../../api/generatedTypes';
import { getTestApprovedItem } from '../../helpers/approvedItem';
import { ApprovedItemInfo } from './ApprovedItemInfo';
import { getDisplayTopic } from '../../helpers/topics';

describe('The ApprovedItemInfo component', () => {
  const item: ApprovedCorpusItem = getTestApprovedItem({
    authors: [
      { name: 'Author One', sortOrder: 1 },
      { name: 'Author Two', sortOrder: 2 },
    ],
    publisher: 'Amazing Machines',
    topic: Topics.PersonalFinance,
    language: CorpusLanguage.De,
    excerpt: 'More words',
    isSyndicated: true,
    isCollection: true,
    isTimeSensitive: true,
  });

  it('shows basic corpus item information', () => {
    render(<ApprovedItemInfo item={item} />);

    expect(screen.getByText('Author One, Author Two')).toBeInTheDocument();
    expect(screen.getByText(item.publisher)).toBeInTheDocument();
    expect(screen.getByText(getDisplayTopic(item.topic))).toBeInTheDocument();
    expect(screen.getByText(item.language)).toBeInTheDocument();
    expect(screen.getByText(item.excerpt)).toBeInTheDocument();
  });

  it('shows corpus item details', () => {
    render(<ApprovedItemInfo item={item} />);

    expect(screen.getByText('Syndicated')).toBeInTheDocument();
    expect(screen.getByText('Time-sensitive')).toBeInTheDocument();
    expect(screen.getByText('Collection')).toBeInTheDocument();
  });

  it('does not show corpus item details if none are valid for this item', () => {
    const anotherItem = {
      ...item,
      isSyndicated: false,
      isCollection: false,
      isTimeSensitive: false,
    };

    render(<ApprovedItemInfo item={anotherItem} />);

    expect(screen.queryByText('Syndicated')).not.toBeInTheDocument();
    expect(screen.queryByText('Time-sensitive')).not.toBeInTheDocument();
    expect(screen.queryByText('Collection')).not.toBeInTheDocument();
  });

  it('shows the image', () => {
    render(<ApprovedItemInfo item={item} />);

    const image = screen.getByAltText(item.title);
    expect(image).toBeInTheDocument();
  });
});
