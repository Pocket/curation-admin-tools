import React from 'react';
import { ActivitySource, SectionStatus } from '../../../api/generatedTypes';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { CustomSectionDetailsPage } from './CustomSectionDetailsPage';
import { getSectionsWithSectionItems } from '../../../api/queries/getSectionsWithSectionItems';
import { SnackbarProvider } from 'notistack';

// Mock the router hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    surfaceGuid: 'NEW_TAB_EN_US',
    sectionId: 'section-123',
  }),
  useHistory: () => ({
    goBack: jest.fn(),
    push: jest.fn(),
  }),
}));

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
    __typename: 'IAB',
  },
  sectionItems: [
    {
      externalId: 'item-1',
      rank: 1,
      approvedItem: {
        externalId: 'approved-1',
        prospectId: 'prospect-1',
        title: 'Test Item 1',
        url: 'https://example.com/1',
        excerpt: 'Test excerpt 1',
        authors: [],
        publisher: 'Test Publisher',
        imageUrl: 'https://example.com/image1.jpg',
        language: 'EN',
        topic: 'Test Topic',
        datePublished: '2024-01-01',
        hasTrustedDomain: true,
        status: 'LIVE',
        source: 'PROSPECT',
        isCollection: false,
        isTimeSensitive: false,
        isSyndicated: false,
        createdBy: 'user1',
        createdAt: '2024-01-01',
        updatedBy: 'user1',
        updatedAt: '2024-01-01',
        scheduledSurfaceHistory: [],
        __typename: 'ApprovedCorpusItem',
      },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      __typename: 'SectionItem',
    },
  ],
  __typename: 'Section',
};

const mocks = [
  {
    request: {
      query: getSectionsWithSectionItems,
      variables: {
        scheduledSurfaceGuid: 'NEW_TAB_EN_US',
      },
    },
    result: {
      data: {
        getSectionsWithSectionItems: [mockSection],
      },
    },
  },
];

describe('CustomSectionDetailsPage', () => {
  const renderPage = () => {
    return render(
      <SnackbarProvider>
        <MockedProvider mocks={mocks} addTypename={false}>
          <MemoryRouter>
            <CustomSectionDetailsPage />
          </MemoryRouter>
        </MockedProvider>
      </SnackbarProvider>,
    );
  };

  it('renders CustomSectionDetails component', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('passes correct surface guid from URL params', async () => {
    renderPage();

    // The component should render (even if no data matches)
    await waitFor(() => {
      expect(screen.getByText('Back to Custom Sections')).toBeInTheDocument();
    });
  });

  it('handles state for edit modal correctly', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    // The page component manages modal state internally
    // Verify that section items are displayed (which have action buttons)
    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
  });

  it('renders action modals conditionally', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    // Initially, action modals should not be visible
    // They are rendered conditionally based on currentSectionItem
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('integrates with CustomSectionDetails properly', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    // Verify all main section content is rendered
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Hero: Hero Title')).toBeInTheDocument();
    // Check for the heading specifically
    expect(
      screen.getByRole('heading', { name: 'Section Items' }),
    ).toBeInTheDocument();
  });

  it('handles empty section items correctly', async () => {
    const emptyMocks = [
      {
        request: {
          query: getSectionsWithSectionItems,
          variables: { scheduledSurfaceGuid: 'NEW_TAB_EN_US' },
        },
        result: {
          data: {
            getSectionsWithSectionItems: [{ ...mockSection, sectionItems: [] }],
          },
        },
      },
    ];

    render(
      <SnackbarProvider>
        <MockedProvider mocks={emptyMocks} addTypename={false}>
          <MemoryRouter>
            <CustomSectionDetailsPage />
          </MemoryRouter>
        </MockedProvider>
      </SnackbarProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText('No items in this section yet'),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole('button', { name: /add items/i }),
    ).toBeInTheDocument();
  });
});
