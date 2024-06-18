import React from 'react';
import { render, screen } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { MockedProvider } from '@apollo/client/testing';
import { ApprovedItemModal } from './ApprovedItemModal';
import { getTestApprovedItem } from '../../helpers/approvedItem';

describe('The ApprovedItemModal component', () => {
  const approvedItem = getTestApprovedItem();
  const showItemTitle = true;
  const heading = 'Test Heading';
  const isRecommendation = true;
  const isOpen = true;
  const onSave = jest.fn();
  const toggleModal = jest.fn();
  const onImageSave = jest.fn();

  it('should render the component with heading and approved item title', () => {
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
      </MockedProvider>,
    );

    // fetch and assert the modal is rendered correctly with its Heading
    expect(screen.getByText(heading)).toBeInTheDocument();

    // should render the approved item's title if showItemTitle prop is true
    expect(screen.getByText(approvedItem.title)).toBeInTheDocument();
  });

  it('should render the component without heading and approved item title', () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={1}>
          <ApprovedItemModal
            approvedItem={approvedItem}
            isOpen={isOpen}
            onSave={onSave}
            toggleModal={toggleModal}
            isRecommendation={isRecommendation}
            onImageSave={onImageSave}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    // assert the modal is not rendered a heading
    expect(screen.queryByText(heading)).toBeNull();

    // assert that the approved item title is not rendered if showItemTitle prop is not passed in
    expect(screen.queryByText(approvedItem.title)).toBeNull();
  });
});
