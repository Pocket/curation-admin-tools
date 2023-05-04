import React from 'react';
import { render, screen } from '@testing-library/react';
import { dateFormat, ShareableListCard } from './ShareableListCard';
import {
  ShareableListComplete,
  ShareableListModerationReason,
  ShareableListModerationStatus,
  ShareableListVisibility,
} from '../../../api/generatedTypes';
import { DateTime } from 'luxon';

describe('The ShareableListCard component', () => {
  const list: ShareableListComplete = {
    externalId: '12345-qwerty',
    user: { id: '12345' },
    title: 'Test list title',
    description: 'Some description',
    slug: 'test-list-title',
    status: ShareableListVisibility.Public,
    moderationStatus: ShareableListModerationStatus.Visible,
    createdAt: '2023-03-27T11:54:03.000Z',
    updatedAt: '2023-03-28T23:09:57.000Z',
    listItemNoteVisibility: ShareableListVisibility.Public,
    listItems: [],
  };

  const listUrl = `https://getpocket.com/sharedlists/${list.externalId}/${list.slug}/`;

  it('displays basic list properties', () => {
    render(<ShareableListCard list={list} refetch={jest.fn()} />);

    expect(screen.getByText(list.title)).toBeInTheDocument();
    // Some punctuation/line breaks are in the same node, so a regex match is needed
    expect(
      screen.getByText(new RegExp(list.description!, 'i'))
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
    render(<ShareableListCard list={list} refetch={jest.fn()} />);

    const link = screen.getByRole('link', { name: listUrl });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', listUrl);
  });

  it('does not show the URL if the list is private', () => {
    // set up a different list that is private
    const privateList = {
      ...list,
      status: ShareableListVisibility.Private,
      slug: undefined,
    };
    render(<ShareableListCard list={privateList} refetch={jest.fn()} />);

    // Let's look for a link to the list... in vain
    const link = screen.queryByRole('link');
    expect(link).not.toBeInTheDocument();

    // There should be an explanatory note instead
    expect(screen.getByText(/this list is private/i)).toBeInTheDocument();
  });

  it('the "Hide List" button is disabled if the list moderationStatus is Hidden', () => {
    // set up a different list that is private
    const privateList = {
      ...list,
      moderationStatus: ShareableListModerationStatus.Hidden,
      slug: undefined,
    };
    render(<ShareableListCard list={privateList} refetch={jest.fn()} />);

    const hideListButton = screen.getByTestId('hide-list-button');
    expect(hideListButton).toHaveAttribute('disabled');
  });

  it('shows the "Hide List" button if the list moderationStatus is Visible', () => {
    // set up a different list that is private
    const privateList = {
      ...list,
      slug: undefined,
    };
    render(<ShareableListCard list={privateList} refetch={jest.fn()} />);

    const hideListButton = screen.getByTestId('hide-list-button');
    expect(hideListButton).toBeInTheDocument();
  });

  it('the "Restore List" button is disabled if the list moderationStatus is Visible', () => {
    // set up a different list that is private
    const privateList = {
      ...list,
      moderationStatus: ShareableListModerationStatus.Hidden,
      moderationReason: ShareableListModerationReason.Fraud,
      moderationDetails: 'more details',
      slug: undefined,
    };
    render(<ShareableListCard list={privateList} refetch={jest.fn()} />);

    const restoreListButton = screen.getByTestId('restore-list-button');
    expect(restoreListButton).toHaveAttribute('disabled');
  });

  it('shows the "Restore List" button if the list moderationStatus is Hidden', () => {
    // set up a different list that is private
    const privateList = {
      ...list,
      moderationStatus: ShareableListModerationStatus.Hidden,
      slug: undefined,
    };
    render(<ShareableListCard list={privateList} refetch={jest.fn()} />);

    const restoreListButton = screen.getByTestId('restore-list-button');
    expect(restoreListButton).toBeInTheDocument();
  });

  it('shows moderationStatus, moderationDetails and restorationReason if properties are present', () => {
    // set up a different list that is private
    const privateList = {
      ...list,
      listItemNoteVisibility: ShareableListVisibility.Public,
      status: ShareableListVisibility.Public,
      moderationStatus: ShareableListModerationStatus.Visible,
      moderationReason: ShareableListModerationReason.Copyright,
      moderationDetails: 'more details',
      restorationReason: 'restored, restored',
      slug: undefined,
    };
    render(<ShareableListCard list={privateList} refetch={jest.fn()} />);

    // let make sure restore list button is not present
    const restoreListButton = screen.getByTestId('restore-list-button');
    expect(restoreListButton).toHaveAttribute('disabled');

    // expect moderationReason to be present
    const moderationReason = screen.getByText(/FRAUD/i);
    expect(moderationReason).toBeInTheDocument();

    //expect moderationDetails to be present
    const moderationDetails = screen.getByText(/more details/i);
    expect(moderationDetails).toBeInTheDocument();
  });

  it('shows moderationStatus and does not show moderationDetails if list moderationStatus is Hidden and moderationDetails is null', () => {
    // set up a different list that is private
    const privateList = {
      ...list,
      moderationStatus: ShareableListModerationStatus.Hidden,
      moderationReason: ShareableListModerationReason.Fraud,
      slug: undefined,
    };
    render(<ShareableListCard list={privateList} refetch={jest.fn()} />);

    // let make sure hide list button is not present
    const hideListButton = screen.queryByRole('button');
    expect(hideListButton).toHaveAttribute('disabled');

    const moderationReason = screen.getByText(/FRAUD/i);
    expect(moderationReason).toBeInTheDocument();

    // make sure moderationDetails is not present if null
    const moderationDetails = screen.queryByText(/more details/i);
    expect(moderationDetails).not.toBeInTheDocument();

    // expect restorationReason to be present
    const restorationReason = screen.getByText(/restored, restored/i);
    expect(restorationReason).toBeInTheDocument();
  });
});
