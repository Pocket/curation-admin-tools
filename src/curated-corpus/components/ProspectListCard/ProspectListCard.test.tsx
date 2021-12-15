import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Prospect } from '../../api/prospect-api/generatedTypes';
import { ProspectListCard } from './ProspectListCard';

describe('The ProspectListCard component', () => {
  let prospect: Prospect;
  const onAddToCorpus = jest.fn();
  const onRecommend = jest.fn();
  const onReject = jest.fn();

  beforeEach(() => {
    prospect = {
      id: '123-abc',
      title: 'How To Win Friends And Influence People with DynamoDB',
      newTab: 'EN_US',
      prospectType: 'organic-timespent',
      url: 'http://www.test.com/how-to',
      imageUrl: 'https://placeimg.com/640/480/people?random=495',
      excerpt:
        'Everything You Wanted to Know About DynamoDB and Were Afraid To Ask',
      language: 'de',
      publisher: 'Amazing Inventions',
      topic: 'Technology',
    };
  });

  it('shows basic prospect information', () => {
    render(
      <MemoryRouter>
        <ProspectListCard
          prospect={prospect}
          onAddToCorpus={onAddToCorpus}
          onRecommend={onRecommend}
          onReject={onReject}
        />
      </MemoryRouter>
    );

    // The image is present and the alt text is the item title
    const photo = screen.getByAltText(prospect.title!);
    expect(photo).toBeInTheDocument();

    // The link to the prospect is present and well-formed
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining(prospect.url));

    // The excerpt is also present
    const excerpt = screen.getByText(/wanted to know about dynamo/i);
    expect(excerpt).toBeInTheDocument();
  });

  it('shows language correctly', () => {
    render(
      <MemoryRouter>
        {' '}
        <ProspectListCard
          prospect={prospect}
          onAddToCorpus={onAddToCorpus}
          onRecommend={onRecommend}
          onReject={onReject}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/^de$/i)).toBeInTheDocument();
  });

  it('shows topic correctly', () => {
    render(
      <MemoryRouter>
        <ProspectListCard
          prospect={prospect}
          onAddToCorpus={onAddToCorpus}
          onRecommend={onRecommend}
          onReject={onReject}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/^technology$/i)).toBeInTheDocument();
  });

  it('should render prospect card with excerpt', () => {
    render(
      <MemoryRouter>
        {' '}
        <ProspectListCard
          prospect={prospect}
          onAddToCorpus={onAddToCorpus}
          onRecommend={onRecommend}
          onReject={onReject}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(prospect.excerpt!)).toBeInTheDocument();
  });

  it('should render curated item card with the action buttons', () => {
    render(
      <MemoryRouter>
        <ProspectListCard
          prospect={prospect}
          onAddToCorpus={onAddToCorpus}
          onRecommend={onRecommend}
          onReject={onReject}
        />
      </MemoryRouter>
    );

    const recommendButton = screen.getByRole('button', {
      name: /Recommend/i,
    });
    const rejectButton = screen.getByRole('button', {
      name: /Reject/i,
    });
    const addToCorpusButton = screen.getByRole('button', {
      name: /Add to Corpus/i,
    });

    expect(recommendButton).toBeInTheDocument();
    expect(rejectButton).toBeInTheDocument();
    expect(addToCorpusButton).toBeInTheDocument();
  });
});
