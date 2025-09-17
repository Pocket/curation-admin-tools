import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { RemoveSectionItemAction } from './RemoveSectionItemAction';
import { getTestApprovedItem } from '../../../helpers/approvedItem';
import { successMock } from '../../../integration-test-mocks/removeSectionItem';
import userEvent from '@testing-library/user-event';
import { apolloCache } from '../../../../api/client';
import {
  ApprovedCorpusItem,
  SectionItem,
} from '../../../../api/generatedTypes';

describe('The RemoveSectionItemAction', () => {
  let mocks: MockedResponse[] = [];
  const item: ApprovedCorpusItem = getTestApprovedItem();
  const mockSectionItem: SectionItem = {
    externalId: 'item-1',
    approvedItem: item,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  it('renders the modal', async () => {
    mocks = [];

    render(
      <MockedProvider mocks={mocks} cache={apolloCache}>
        <SnackbarProvider maxSnack={3}>
          <RemoveSectionItemAction
            sectionItem={mockSectionItem}
            toggleModal={jest.fn()}
            modalOpen={true}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    // Check the modal heading
    expect(screen.getByText(/remove this section item/i)).toBeInTheDocument();

    // Check the form
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('completes the action successfully', async () => {
    mocks = [successMock];

    render(
      <MockedProvider mocks={mocks} cache={apolloCache}>
        <SnackbarProvider maxSnack={3}>
          <RemoveSectionItemAction
            sectionItem={mockSectionItem}
            toggleModal={jest.fn()}
            modalOpen={true}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    const reason = screen.getByLabelText(/dated/i);
    userEvent.click(reason);
    userEvent.click(screen.getByText(/save/i));

    expect(
      await screen.findByText(/item removed successfully/i),
    ).toBeInTheDocument();
  });
});
