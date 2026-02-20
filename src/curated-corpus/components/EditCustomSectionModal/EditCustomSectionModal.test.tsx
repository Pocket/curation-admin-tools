import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { SnackbarProvider } from 'notistack';
import { EditCustomSectionModal } from './EditCustomSectionModal';
import { ActivitySource, SectionStatus } from '../../../api/generatedTypes';

describe('EditCustomSectionModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  const mockSection = {
    externalId: 'section-123',
    title: 'Test Section',
    description: 'Test Description',
    heroTitle: 'Hero Title',
    heroDescription: 'Hero Description',
    active: true,
    disabled: false,
    status: SectionStatus.Live,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    createSource: ActivitySource.Manual,
    scheduledSurfaceGuid: 'NEW_TAB_EN_US',
    sort: 1,
    createdAt: 1704067200,
    updatedAt: 1704067200,
    iab: {
      taxonomy: 'IAB-3.0',
      categories: ['IAB1'],
    },
    sectionItems: [],
    followable: true,
    allowAds: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when open', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <SnackbarProvider>
          <EditCustomSectionModal
            isOpen={true}
            onClose={mockOnClose}
            section={mockSection}
            scheduledSurfaceGuid="NEW_TAB_EN_US"
            onSuccess={mockOnSuccess}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    expect(screen.getByText('Edit Custom Section')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <SnackbarProvider>
          <EditCustomSectionModal
            isOpen={false}
            onClose={mockOnClose}
            section={mockSection}
            scheduledSurfaceGuid="NEW_TAB_EN_US"
            onSuccess={mockOnSuccess}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    expect(screen.queryByText('Edit Custom Section')).not.toBeInTheDocument();
  });

  it('should render CustomSectionFormConnector inside', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <SnackbarProvider>
          <EditCustomSectionModal
            isOpen={true}
            onClose={mockOnClose}
            section={mockSection}
            scheduledSurfaceGuid="NEW_TAB_EN_US"
            onSuccess={mockOnSuccess}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    // Check if form is rendered - looking for start date label
    expect(screen.getByText('Start Date')).toBeInTheDocument();
  });

  it('should populate form with section data', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <SnackbarProvider>
          <EditCustomSectionModal
            isOpen={true}
            onClose={mockOnClose}
            section={mockSection}
            scheduledSurfaceGuid="NEW_TAB_EN_US"
            onSuccess={mockOnSuccess}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    // Check that the section title is displayed
    const titleInput = screen.getByDisplayValue('Test Section');
    expect(titleInput).toBeInTheDocument();
  });

  it('should render with dialog title', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <SnackbarProvider>
          <EditCustomSectionModal
            isOpen={true}
            onClose={mockOnClose}
            section={mockSection}
            scheduledSurfaceGuid="NEW_TAB_EN_US"
            onSuccess={mockOnSuccess}
          />
        </SnackbarProvider>
      </MockedProvider>,
    );

    // The dialog should have the Edit Custom Section title
    await waitFor(() => {
      expect(screen.getByText('Edit Custom Section')).toBeInTheDocument();
    });
  });
});
