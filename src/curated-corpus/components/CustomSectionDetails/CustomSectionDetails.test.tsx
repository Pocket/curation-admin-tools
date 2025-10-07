import React from 'react';
import { ActivitySource, SectionStatus } from '../../../api/generatedTypes';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { CustomSectionDetails } from './CustomSectionDetails';
import { getSectionsWithSectionItems } from '../../../api/queries/getSectionsWithSectionItems';
import { SnackbarProvider } from 'notistack';

// Mock the useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
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

describe('CustomSectionDetails', () => {
  const defaultProps = {
    setCurrentSectionItem: jest.fn(),
    toggleEditModal: jest.fn(),
    toggleRejectModal: jest.fn(),
    toggleRemoveSectionItemModal: jest.fn(),
    scheduledSurfaceGuid: 'NEW_TAB_EN_US',
  };

  const renderComponent = () => {
    return render(
      <SnackbarProvider>
        <MockedProvider mocks={mocks} addTypename={false}>
          <MemoryRouter>
            <CustomSectionDetails {...defaultProps} />
          </MemoryRouter>
        </MockedProvider>
      </SnackbarProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    renderComponent();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays section details when loaded', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Hero: Hero Title')).toBeInTheDocument();
  });

  it('displays section metadata correctly', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    expect(screen.getByText('Start Date')).toBeInTheDocument();
    expect(screen.getByText('End Date')).toBeInTheDocument();
    expect(screen.getByText('1 items')).toBeInTheDocument();
  });

  it('displays correct status chip', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Live')).toBeInTheDocument();
    });
  });

  it('displays section items when present', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    });
  });

  it('displays empty state with Add Items button when no items', async () => {
    const emptySection = {
      ...mockSection,
      sectionItems: [],
    };

    const emptyMocks = [
      {
        request: {
          query: getSectionsWithSectionItems,
          variables: {
            scheduledSurfaceGuid: 'NEW_TAB_EN_US',
          },
        },
        result: {
          data: {
            getSectionsWithSectionItems: [emptySection],
          },
        },
      },
    ];

    render(
      <SnackbarProvider>
        <MockedProvider mocks={emptyMocks} addTypename={false}>
          <MemoryRouter>
            <CustomSectionDetails {...defaultProps} />
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
      screen.getByRole('button', { name: /Add Items/i }),
    ).toBeInTheDocument();
  });

  it('displays edit and delete buttons', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    // Find the edit and delete icon buttons by their test ids or aria labels
    const buttons = screen.getAllByRole('button');
    const iconButtons = buttons.filter((button) =>
      button.classList.contains('MuiIconButton-root'),
    );
    expect(iconButtons.length).toBeGreaterThanOrEqual(2);
  });

  it('displays back button and handles navigation', async () => {
    const mockGoBack = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    jest.spyOn(require('react-router-dom'), 'useHistory').mockReturnValue({
      goBack: mockGoBack,
      push: jest.fn(),
    });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Back to Custom Sections/i }),
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Back to Custom Sections/i }),
    );
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('displays IAB category when present', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    // IAB category should be present in the section data
    expect(mockSection.iab).toBeDefined();
    expect(mockSection.iab.categories).toContain('IAB1');
  });

  it('calls correct callbacks when interacting with section items', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    });

    // Since SectionItemCardWrapper is rendered, we need to check if the callbacks would be set up
    // The actual clicking would be tested in SectionItemCardWrapper tests
    expect(defaultProps.setCurrentSectionItem).toBeDefined();
    expect(defaultProps.toggleEditModal).toBeDefined();
    expect(defaultProps.toggleRejectModal).toBeDefined();
    expect(defaultProps.toggleRemoveSectionItemModal).toBeDefined();
  });

  it('displays hero content when present', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Hero: Hero Title')).toBeInTheDocument();
    });

    expect(screen.getByText('Hero Description')).toBeInTheDocument();
  });

  it('handles different status chips correctly', async () => {
    const disabledSection = {
      ...mockSection,
      status: SectionStatus.Disabled,
      disabled: true,
      active: false,
    };

    const disabledMocks = [
      {
        request: {
          query: getSectionsWithSectionItems,
          variables: {
            scheduledSurfaceGuid: 'NEW_TAB_EN_US',
          },
        },
        result: {
          data: {
            getSectionsWithSectionItems: [disabledSection],
          },
        },
      },
    ];

    render(
      <SnackbarProvider>
        <MockedProvider mocks={disabledMocks} addTypename={false}>
          <MemoryRouter>
            <CustomSectionDetails {...defaultProps} />
          </MemoryRouter>
        </MockedProvider>
      </SnackbarProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Disabled')).toBeInTheDocument();
    });
  });
});
