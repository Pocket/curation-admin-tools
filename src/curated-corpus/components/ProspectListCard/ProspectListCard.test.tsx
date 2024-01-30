import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  CorpusLanguage,
  Item,
  Prospect,
  Topics,
} from '../../../api/generatedTypes';
import { ProspectListCard } from './ProspectListCard';
import userEvent from '@testing-library/user-event';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';

describe('The ProspectListCard component', () => {
  let prospect: Prospect;
  let parserItem: Item;

  const onAddToCorpus = jest.fn();
  const onRecommend = jest.fn();
  const onReject = jest.fn();
  const onDismissProspect = jest.fn();

  beforeEach(() => {
    parserItem = {
      itemId: 'test-id',
      givenUrl: 'www.test-item.com',
      normalUrl: 'www.test-normal-item.com',
      timeToRead: 5,
    };

    prospect = {
      id: '123-abc',
      prospectId: '456-dfg',
      title: 'How To Win Friends And Influence People with DynamoDB',
      scheduledSurfaceGuid: 'NEW_TAB_EN_US',
      prospectType: 'organic-timespent',
      url: 'http://www.test.com/how-to',
      imageUrl: 'https://placeimg.com/640/480/people?random=495',
      excerpt:
        'Everything You Wanted to Know About DynamoDB and Were Afraid To Ask',
      language: CorpusLanguage.De,
      publisher: 'Amazing Inventions',
      authors: 'Charles Dickens,O. Henry',
      topic: Topics.Technology,
      saveCount: 111222,
      isSyndicated: false,
      item: {
        ...parserItem,
      },
    };
  });

  const renderComponent = (mocks?: MockedResponse[]) => {
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <ProspectListCard
            prospect={prospect}
            onAddToCorpus={onAddToCorpus}
            onRecommend={onRecommend}
            onReject={onReject}
            onDismissProspect={onDismissProspect}
            parserItem={prospect.item!}
          />
        </MemoryRouter>
      </MockedProvider>
    );
  };

  it('shows basic prospect information', () => {
    renderComponent();

    // The image is present and the alt text is the item title
    const photo = screen.getByAltText(prospect.title!);
    expect(photo).toBeInTheDocument();

    // The link to the prospect is present and well-formed
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining(prospect.url));
    // The link also opens in a new tab
    expect(link).toHaveAttribute('target', expect.stringContaining('_blank'));

    // The excerpt is also present
    const excerpt = screen.getByText(/wanted to know about dynamo/i);
    expect(excerpt).toBeInTheDocument();

    // And the authors
    const authors = screen.getByText(prospect.authors!);
    expect(authors).toBeInTheDocument();

    // And even the publisher
    const publisher = screen.getByText(prospect.publisher!);
    expect(publisher).toBeInTheDocument();
  });

  it('shows language correctly', () => {
    renderComponent();

    expect(screen.getByText(/^de$/i)).toBeInTheDocument();
  });

  it('shows topic correctly', () => {
    renderComponent();

    expect(screen.getByText(/^technology$/i)).toBeInTheDocument();
  });

  it('should render prospect card with excerpt', () => {
    renderComponent();

    expect(screen.getByText(prospect.excerpt!)).toBeInTheDocument();
  });

  it('should show the number of saves', () => {
    renderComponent();

    expect(screen.getByText(`${prospect.saveCount} saves`)).toBeInTheDocument();
  });

  it("should show the prospect's source", () => {
    renderComponent();

    expect(
      screen.getByText(prospect.prospectType.toLowerCase())
    ).toBeInTheDocument();
  });

  it("should hide 'Syndicated' tag if prospect is not syndicated", () => {
    renderComponent();

    expect(screen.queryByText('Syndicated')).not.toBeInTheDocument();
  });

  it('should show "Syndicated" tag if displaying a syndicated article', () => {
    prospect.isSyndicated = true;

    renderComponent();

    expect(screen.getByText('Syndicated')).toBeInTheDocument();
  });

  it('should render time to read when prospect has a time to read', () => {
    renderComponent();

    expect(
      screen.getByText(`${prospect.item?.timeToRead} min(s)`)
    ).toBeInTheDocument();
  });

  it('should not render time to read when prospect does not a time to read', () => {
    // setting time to read to undefined
    parserItem.timeToRead = undefined;

    // modifying prospect item to not have a time to read
    prospect = {
      ...prospect,
      item: {
        ...parserItem,
      },
    };

    renderComponent();

    expect(
      screen.queryByText(`${prospect.item?.timeToRead} min(s)`)
    ).not.toBeInTheDocument();
  });

  it('should render when prospect does not have a parser object', () => {
    prospect = {
      ...prospect,
      item: null,
    };

    renderComponent();

    expect(
      screen.queryByText(`${prospect.item?.timeToRead} min(s)`)
    ).not.toBeInTheDocument();
  });

  it('should render prospect card with the action buttons', () => {
    renderComponent();

    const recommendButton = screen.getByRole('button', {
      name: /Recommend/i,
    });
    const rejectButton = screen.getByRole('button', {
      name: /Reject/i,
    });
    const addToCorpusButton = screen.getByRole('button', {
      name: /Add to Corpus/i,
    });

    const dismissProspectButton = screen.getByTestId('dismissButton');

    expect(recommendButton).toBeInTheDocument();
    expect(rejectButton).toBeInTheDocument();
    expect(addToCorpusButton).toBeInTheDocument();
    expect(dismissProspectButton).toBeInTheDocument();
  });

  it('should run an action on pressing the "Recommend" button', () => {
    renderComponent();

    userEvent.click(
      screen.getByRole('button', {
        name: /Recommend/i,
      })
    );

    expect(onRecommend).toHaveBeenCalled();
  });

  it('should run an action on pressing the "Reject" button', () => {
    renderComponent();

    userEvent.click(
      screen.getByRole('button', {
        name: /Reject/i,
      })
    );

    expect(onReject).toHaveBeenCalled();
  });

  it('should run an action on pressing the "Add to corpus" button', () => {
    renderComponent();

    userEvent.click(
      screen.getByRole('button', {
        name: /Add to corpus/i,
      })
    );

    expect(onAddToCorpus).toHaveBeenCalled();
  });
});
