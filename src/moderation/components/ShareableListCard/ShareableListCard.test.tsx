import React from 'react';
import { render, screen } from '@testing-library/react';
import { dateFormat, ShareableListCard } from './ShareableListCard';
import {
  ShareableListComplete,
  ShareableListModerationStatus,
  ShareableListStatus,
} from '../../../api/generatedTypes';
import { DateTime } from 'luxon';

describe('The ShareableListCard component', () => {
  const list: ShareableListComplete = {
    externalId: '12345-qwerty',
    user: { id: '12345' },
    title: 'Test list title',
    description: 'Some description',
    slug: 'test-list-title',
    status: ShareableListStatus.Public,
    moderationStatus: ShareableListModerationStatus.Visible,
    createdAt: '2023-03-27T11:54:03.000Z',
    updatedAt: '2023-03-28T23:09:57.000Z',
    listItems: [],
  };

  const listUrl = `https://getpocket.com/sharedlists/${list.externalId}/${list.slug}/`;

  it('displays basic list properties', () => {
    render(<ShareableListCard list={list} />);

    expect(screen.getByText(list.title)).toBeInTheDocument();
    // Some punctuation/line breaks are in the same node, so a regex match is needed
    expect(
      screen.getByText(new RegExp(list.description, 'i'))
    ).toBeInTheDocument();
    expect(screen.getByText(list.status)).toBeInTheDocument();
    expect(screen.getByText(list.moderationStatus)).toBeInTheDocument();

    // And the timestamps
    const createdAt = DateTime.fromISO(list.createdAt).toFormat(dateFormat);
    expect(screen.getByText(new RegExp(createdAt, 'i'))).toBeInTheDocument();

    const updatedAt = DateTime.fromISO(list.updatedAt).toFormat(dateFormat);
    expect(screen.getByText(new RegExp(updatedAt, 'i'))).toBeInTheDocument();
  });

  it('forms the list URL correctly and shows it if the list is public', () => {
    render(<ShareableListCard list={list} />);

    const link = screen.getByRole('link', { name: listUrl });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', listUrl);
  });

  it('does not show the URL if the list is private', () => {
    // set up a different list that is private
    const privateList = {
      ...list,
      status: ShareableListStatus.Private,
      slug: undefined,
    };
    render(<ShareableListCard list={privateList} />);

    // Let's look for a link to the list... in vain
    const link = screen.queryByRole('link');
    expect(link).not.toBeInTheDocument();

    // There should be an explanatory note instead
    expect(screen.getByText(/this list is private/i)).toBeInTheDocument();
  });
});
