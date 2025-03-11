import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { SectionDetails } from './SectionDetails';
import { MockedProvider } from '@apollo/client/testing';
import {
  ActivitySource,
  ApprovedCorpusItem,
  Section,
} from '../../../api/generatedTypes';
import { getTestApprovedItem } from '../../helpers/approvedItem';

describe('The SectionDetails component', () => {
  const item: ApprovedCorpusItem = getTestApprovedItem();
  const mockSections: Section[] = [
    // enabled section
    {
      externalId: '1',
      title: 'Section 1',
      active: true,
      disabled: false,
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
    },
    // disabled section
    {
      externalId: '2',
      title: 'Section 2',
      active: true,
      disabled: true,
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
    },
  ];

  const mockSetCurrentSectionItem = jest.fn();
  const mockToggleEditModal = jest.fn();
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
            refetch={mockRefetch}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    expect(screen.getByText('Section 1')).toBeInTheDocument();
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

  it('should render & click remove button', async () => {
    render(
      <MockedProvider>
        <SnackbarProvider maxSnack={3}>
          <SectionDetails
            sections={mockSections}
            currentSection="Section 1"
            setCurrentSectionItem={mockSetCurrentSectionItem}
            currentScheduledSurfaceGuid="NEW_TAB_EN_US"
            toggleEditModal={mockToggleEditModal}
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
            refetch={mockRefetch}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );
    const enableSwitch = screen.getByRole('checkbox', { name: /enable/i });
    expect(enableSwitch).toBeInTheDocument();
  });
});
