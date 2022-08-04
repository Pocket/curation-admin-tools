import React from 'react';
import { render, screen } from '@testing-library/react';

import { ApprovedItemModal } from './ApprovedItemModal';
import {
  ApprovedCorpusItem,
  CorpusItemSource,
  CorpusLanguage,
  CuratedStatus,
  Topics,
} from '../../../api/generatedTypes';
import { SnackbarProvider } from 'notistack';
import { MockedProvider } from '@apollo/client/testing';

describe('The ApprovedItemModal component', () => {
  const approvedItem: ApprovedCorpusItem = {
    externalId: '123-abc',
    prospectId: '123-xyz',
    title: 'How To Win Friends And Influence People with React',
    url: 'http://www.test.com/how-to',
    imageUrl: 'https://placeimg.com/640/480/people?random=494',
    excerpt: 'Everything You Wanted to Know About React and Were Afraid To Ask',
    language: CorpusLanguage.De,
    authors: [{ name: 'One Author', sortOrder: 1 }],
    publisher: 'Amazing Inventions',
    topic: Topics.HealthFitness,
    source: CorpusItemSource.Prospect,
    status: CuratedStatus.Recommendation,
    isCollection: false,
    isSyndicated: false,
    isTimeSensitive: false,
    createdAt: 1635014926,
    createdBy: 'Amy',
    updatedAt: 1635114926,
    scheduledSurfaceHistory: [],
  };
  const showItemTitle = true;
  const heading = 'Test Heading';
  const isRecommendation = true;
  const isOpen = true;
  const onSave = jest.fn();
  const toggleModal = jest.fn();
  const onImageSave = jest.fn();

  it('should render the component', () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={1}>
          <ApprovedItemModal
            approvedItem={approvedItem}
            isOpen={isOpen}
            onSave={onSave}
            toggleModal={toggleModal}
            heading={heading}
            isRecommendation={isRecommendation}
            onImageSave={onImageSave}
            showItemTitle={showItemTitle}
          />
        </SnackbarProvider>
      </MockedProvider>
    );

    // fetch and assert the modal is rendered correctly with its Heading
    expect(screen.getByText(heading)).toBeInTheDocument();

    // should render the approved item's title if showItemTitle prop is true
    expect(screen.getByText(approvedItem.title)).toBeInTheDocument();
  });
});
