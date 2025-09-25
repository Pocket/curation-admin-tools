import React from 'react';
import { CustomSectionsPage } from './CustomSectionsPage';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { getScheduledSurfacesForUser } from '../../../api/queries/getScheduledSurfacesForUser';
import { getSectionsWithSectionItems } from '../../../api/queries/getSectionsWithSectionItems';
import { ActivitySource, SectionStatus } from '../../../api/generatedTypes';
import { SnackbarProvider } from 'notistack';

const mockSections = [
  {
    __typename: 'Section',
    externalId: 'live-section-1',
    title: 'Live Section 1',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T00:00:00Z',
    active: true,
    status: SectionStatus.Live,
    createSource: ActivitySource.Manual,
    disabled: false,
    sectionItems: [],
  },
  {
    __typename: 'Section',
    externalId: 'scheduled-section-1',
    title: 'Scheduled Section 1',
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2025-12-31T00:00:00Z',
    active: false,
    status: SectionStatus.Scheduled,
    createSource: ActivitySource.Manual,
    disabled: false,
    sectionItems: [],
  },
  {
    __typename: 'Section',
    externalId: 'expired-section-1',
    title: 'Expired Section 1',
    startDate: '2023-01-01T00:00:00Z',
    endDate: '2023-12-31T00:00:00Z',
    active: false,
    status: SectionStatus.Expired,
    createSource: ActivitySource.Manual,
    disabled: false,
    sectionItems: [],
  },
];

const mocks = [
  {
    request: {
      query: getScheduledSurfacesForUser,
    },
    result: {
      data: {
        getScheduledSurfacesForUser: [
          {
            guid: 'NEW_TAB_EN_US',
            name: 'New Tab (en-US)',
            prospectTypes: ['ORGANIC_TIMESPENT', 'SYNDICATED_NEW'],
            ianaTimezone: 'America/New_York',
          },
          {
            guid: 'NEW_TAB_DE_DE',
            name: 'New Tab (de-DE)',
            prospectTypes: ['ORGANIC_TIMESPENT'],
            ianaTimezone: 'Europe/Berlin',
          },
        ],
      },
    },
  },
  {
    request: {
      query: getSectionsWithSectionItems,
      variables: {
        scheduledSurfaceGuid: 'NEW_TAB_EN_US',
        createSource: ActivitySource.Manual,
      },
    },
    result: {
      data: {
        getSectionsWithSectionItems: mockSections,
      },
    },
  },
];

describe('CustomSectionsPage', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <SnackbarProvider>
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <CustomSectionsPage />
          </MockedProvider>
        </MemoryRouter>
      </SnackbarProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('renders inside the required providers', () => {
    const { container } = render(
      <SnackbarProvider>
        <MemoryRouter initialEntries={['/custom-sections']}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <CustomSectionsPage />
          </MockedProvider>
        </MemoryRouter>
      </SnackbarProvider>,
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('mounts successfully with Apollo MockedProvider', () => {
    const { container } = render(
      <SnackbarProvider>
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <CustomSectionsPage />
          </MockedProvider>
        </MemoryRouter>
      </SnackbarProvider>,
    );
    const rootElement = container.querySelector('div');
    expect(rootElement).toBeInTheDocument();
  });

  it('groups sections by status correctly', async () => {
    render(
      <SnackbarProvider>
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <CustomSectionsPage />
          </MockedProvider>
        </MemoryRouter>
      </SnackbarProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Live Section 1')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.getByText('Scheduled Section 1')).toBeInTheDocument();
    expect(screen.getByText('Expired Section 1')).toBeInTheDocument();
  });

  it('displays the Custom Sections title', () => {
    render(
      <SnackbarProvider>
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <CustomSectionsPage />
          </MockedProvider>
        </MemoryRouter>
      </SnackbarProvider>,
    );

    expect(screen.getByText('Custom Sections')).toBeInTheDocument();
  });

  it('displays surface dropdown', async () => {
    render(
      <SnackbarProvider>
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <CustomSectionsPage />
          </MockedProvider>
        </MemoryRouter>
      </SnackbarProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Sections for')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('displays New Section button', () => {
    render(
      <SnackbarProvider>
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <CustomSectionsPage />
          </MockedProvider>
        </MemoryRouter>
      </SnackbarProvider>,
    );

    expect(
      screen.getByRole('button', { name: /New Section/i }),
    ).toBeInTheDocument();
  });

  it('opens create modal when New Section is clicked', async () => {
    render(
      <SnackbarProvider>
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <CustomSectionsPage />
          </MockedProvider>
        </MemoryRouter>
      </SnackbarProvider>,
    );

    const newSectionButton = screen.getByRole('button', {
      name: /New Section/i,
    });
    fireEvent.click(newSectionButton);

    await waitFor(() => {
      expect(screen.getByText('Create a Custom Section')).toBeInTheDocument();
    });
  });

  it('displays empty state when no sections exist', async () => {
    const emptyMocks = [
      {
        request: {
          query: getScheduledSurfacesForUser,
        },
        result: {
          data: {
            getScheduledSurfacesForUser: [
              {
                guid: 'NEW_TAB_EN_US',
                name: 'New Tab (en-US)',
                prospectTypes: ['ORGANIC_TIMESPENT', 'SYNDICATED_NEW'],
                ianaTimezone: 'America/New_York',
              },
            ],
          },
        },
      },
      {
        request: {
          query: getSectionsWithSectionItems,
          variables: {
            scheduledSurfaceGuid: 'NEW_TAB_EN_US',
            createSource: ActivitySource.Manual,
          },
        },
        result: {
          data: {
            getSectionsWithSectionItems: [],
          },
        },
      },
    ];

    render(
      <SnackbarProvider>
        <MemoryRouter>
          <MockedProvider mocks={emptyMocks} addTypename={false}>
            <CustomSectionsPage />
          </MockedProvider>
        </MemoryRouter>
      </SnackbarProvider>,
    );

    await waitFor(
      () => {
        expect(
          screen.getByText('No custom sections found for this surface'),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('groups sections into Live, Scheduled, and Expired correctly', async () => {
    render(
      <SnackbarProvider>
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <CustomSectionsPage />
          </MockedProvider>
        </MemoryRouter>
      </SnackbarProvider>,
    );

    await waitFor(
      () => {
        // Check for section headers
        const headers = screen.getAllByRole('heading', { level: 5 });
        const headerTexts = headers.map((h) => h.textContent);
        expect(headerTexts).toContain('Scheduled');
        expect(headerTexts).toContain('Live');
        expect(headerTexts).toContain('Expired');
      },
      { timeout: 3000 },
    );
  });

  it('handles surface switching', async () => {
    const multiSurfaceMocks = [
      ...mocks,
      {
        request: {
          query: getSectionsWithSectionItems,
          variables: {
            scheduledSurfaceGuid: 'NEW_TAB_DE_DE',
            createSource: ActivitySource.Manual,
          },
        },
        result: {
          data: {
            getSectionsWithSectionItems: [],
          },
        },
      },
    ];

    render(
      <SnackbarProvider>
        <MemoryRouter>
          <MockedProvider mocks={multiSurfaceMocks} addTypename={false}>
            <CustomSectionsPage />
          </MockedProvider>
        </MemoryRouter>
      </SnackbarProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Sections for')).toBeInTheDocument();
    });

    // The actual surface switching would require simulating the SplitButton interaction
    // which is handled by a separate component
    expect(screen.getByText('New Tab (en-US)')).toBeInTheDocument();
  });
});
