import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { SectionDetails } from './SectionDetails';
import { MockedProvider } from '@apollo/client/testing';
import {
  ActivitySource,
  ApprovedCorpusItem,
  IabMetadata,
  Section,
  SectionStatus,
} from '../../../api/generatedTypes';
import { getTestApprovedItem } from '../../helpers/approvedItem';

describe('The SectionDetails component', () => {
  const item: ApprovedCorpusItem = getTestApprovedItem();
  const iabMetadata1: IabMetadata = {
    taxonomy: 'IAB-3.0',
    categories: ['339'], // Adult Contemporary Music (Tier 3)
  };
  const iabMetadata2: IabMetadata = {
    taxonomy: 'IAB-3.0',
    categories: ['335'], // Fantasy (Tier 2)
  };

  const mockSections: Section[] = [
    // enabled section
    {
      externalId: '1',
      title: 'Section 1',
      description: 'Section 1 description',
      iab: iabMetadata1,
      active: true,
      disabled: false,
      status: SectionStatus.Live,
      sectionItems: [
        {
          externalId: 'item-1',
          approvedItem: item,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createSource: ActivitySource.Ml,
      scheduledSurfaceGuid: 'NEW_TAB_EN_US',
      followable: true,
      allowAds: true,
    },
    // disabled section
    {
      externalId: '2',
      title: 'Section 2',
      iab: iabMetadata2,
      active: true,
      disabled: true,
      status: SectionStatus.Disabled,
      sectionItems: [
        {
          externalId: 'item-2',
          approvedItem: item,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createSource: ActivitySource.Ml,
      scheduledSurfaceGuid: 'NEW_TAB_EN_US',
      followable: true,
      allowAds: true,
    },
  ];

  const mockSetCurrentSectionItem = jest.fn();
  const mockToggleEditModal = jest.fn();
  const mockToggleRejectModal = jest.fn();
  const mockToggleRemoveSectionItemModal = jest.fn();
  const mockRefetch = jest.fn();

  it('should render all sections when currentSection is "all"', () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <SectionDetails
            sections={mockSections}
            currentSection="all"
            setCurrentSectionItem={mockSetCurrentSectionItem}
            currentScheduledSurfaceGuid="NEW_TAB_EN_US"
            toggleEditModal={mockToggleEditModal}
            toggleRejectModal={mockToggleRejectModal}
            toggleRemoveSectionItemModal={mockToggleRemoveSectionItemModal}
            refetch={mockRefetch}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 1 description')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
  });

  it('should render only the selected section', () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <SectionDetails
            sections={mockSections}
            currentSection="Section 1"
            setCurrentSectionItem={mockSetCurrentSectionItem}
            currentScheduledSurfaceGuid="NEW_TAB_EN_US"
            toggleEditModal={mockToggleEditModal}
            toggleRejectModal={mockToggleRejectModal}
            toggleRemoveSectionItemModal={mockToggleRemoveSectionItemModal}
            refetch={mockRefetch}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.queryByText('Section 2')).not.toBeInTheDocument();
  });

  it('should not render sections when there are no matching sections', () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <SectionDetails
            sections={mockSections}
            currentSection="section-does-not-exist"
            setCurrentSectionItem={mockSetCurrentSectionItem}
            currentScheduledSurfaceGuid="NEW_TAB_EN_US"
            toggleEditModal={mockToggleEditModal}
            toggleRejectModal={mockToggleRejectModal}
            toggleRemoveSectionItemModal={mockToggleRemoveSectionItemModal}
            refetch={mockRefetch}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    expect(screen.queryByText('Section 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Section 2')).not.toBeInTheDocument();
  });

  it('should call setCurrentSectionItem and toggleEditModal on editButton click', async () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <SectionDetails
            sections={mockSections}
            currentSection="Section 1"
            setCurrentSectionItem={mockSetCurrentSectionItem}
            currentScheduledSurfaceGuid="NEW_TAB_EN_US"
            toggleEditModal={mockToggleEditModal}
            toggleRejectModal={mockToggleRejectModal}
            toggleRemoveSectionItemModal={mockToggleRemoveSectionItemModal}
            refetch={mockRefetch}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    expect(editButton).toBeInTheDocument();
    userEvent.click(editButton);

    expect(mockSetCurrentSectionItem).toHaveBeenCalledWith(
      mockSections[0].sectionItems[0],
    );
    expect(mockToggleEditModal).toHaveBeenCalled();
  });

  it('should call setCurrentSectionItem and toggleRejectModal on rejectButton click', async () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <SectionDetails
            sections={mockSections}
            currentSection="Section 1"
            setCurrentSectionItem={mockSetCurrentSectionItem}
            currentScheduledSurfaceGuid="NEW_TAB_EN_US"
            toggleEditModal={mockToggleEditModal}
            toggleRejectModal={mockToggleRejectModal}
            toggleRemoveSectionItemModal={mockToggleRemoveSectionItemModal}
            refetch={mockRefetch}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    const rejectButton = screen.getByRole('button', { name: /reject/i });
    expect(rejectButton).toBeInTheDocument();
    userEvent.click(rejectButton);

    expect(mockSetCurrentSectionItem).toHaveBeenCalledWith(
      mockSections[0].sectionItems[0],
    );
    expect(mockToggleRejectModal).toHaveBeenCalled();
  });

  it('should call setCurrentSectionItem and toggleRemoveSectionItemModal on removeButton click', async () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <SectionDetails
            sections={mockSections}
            currentSection="Section 1"
            setCurrentSectionItem={mockSetCurrentSectionItem}
            currentScheduledSurfaceGuid="NEW_TAB_EN_US"
            toggleEditModal={mockToggleEditModal}
            toggleRejectModal={mockToggleRejectModal}
            toggleRemoveSectionItemModal={mockToggleRemoveSectionItemModal}
            refetch={mockRefetch}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    const removeButton = screen.getByRole('button', { name: /remove/i });
    expect(removeButton).toBeInTheDocument();
    userEvent.click(removeButton);

    expect(mockSetCurrentSectionItem).toHaveBeenCalledWith(
      mockSections[0].sectionItems[0],
    );
    expect(mockToggleRemoveSectionItemModal).toHaveBeenCalled();
  });

  it('should render & toggle the Disable switch', async () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <SectionDetails
            sections={mockSections}
            currentSection="Section 1" // section to be disabled
            setCurrentSectionItem={mockSetCurrentSectionItem}
            currentScheduledSurfaceGuid="NEW_TAB_EN_US"
            toggleEditModal={mockToggleEditModal}
            toggleRejectModal={mockToggleRejectModal}
            toggleRemoveSectionItemModal={mockToggleRemoveSectionItemModal}
            refetch={mockRefetch}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );
    const disableSwitch = screen.getByRole('checkbox', { name: /disable/i });
    expect(disableSwitch).toBeInTheDocument();
  });

  it('should render & toggle the Enable switch', async () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <SectionDetails
            sections={mockSections}
            currentSection="Section 2" // section to be disabled
            setCurrentSectionItem={mockSetCurrentSectionItem}
            currentScheduledSurfaceGuid="NEW_TAB_EN_US"
            toggleEditModal={mockToggleEditModal}
            toggleRejectModal={mockToggleRejectModal}
            toggleRemoveSectionItemModal={mockToggleRemoveSectionItemModal}
            refetch={mockRefetch}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );
    const enableSwitch = screen.getByRole('checkbox', { name: /enable/i });
    expect(enableSwitch).toBeInTheDocument();
  });

  it('should render IAB labels', async () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <SectionDetails
            sections={mockSections}
            currentSection="all"
            setCurrentSectionItem={mockSetCurrentSectionItem}
            currentScheduledSurfaceGuid="NEW_TAB_EN_US"
            toggleEditModal={mockToggleEditModal}
            toggleRejectModal={mockToggleRejectModal}
            toggleRemoveSectionItemModal={mockToggleRemoveSectionItemModal}
            refetch={mockRefetch}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();

    // check IAB labels
    // IAB label for Section 1
    expect(
      screen.getByText('Entertainment → Music → Adult Contemporary Music'),
    ).toBeInTheDocument();

    // IAB label for Section 2
    expect(screen.getByText('Genres → Fantasy')).toBeInTheDocument();
  });
});
