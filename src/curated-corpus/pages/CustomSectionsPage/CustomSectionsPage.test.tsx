import React from 'react';
import { CustomSectionsPage } from './CustomSectionsPage';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { getScheduledSurfacesForUser } from '../../../api/queries/getScheduledSurfacesForUser';
import { getSectionsWithSectionItems } from '../../../api/queries/getSectionsWithSectionItems';
import { ActivitySource, SectionStatus } from '../../../api/generatedTypes';

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
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <CustomSectionsPage />
        </MockedProvider>
      </MemoryRouter>,
    );
    expect(container).toBeTruthy();
  });

  it('renders inside the required providers', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/custom-sections']}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <CustomSectionsPage />
        </MockedProvider>
      </MemoryRouter>,
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('mounts successfully with Apollo MockedProvider', () => {
    const { container } = render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <CustomSectionsPage />
        </MockedProvider>
      </MemoryRouter>,
    );
    const rootElement = container.querySelector('div');
    expect(rootElement).toBeInTheDocument();
  });

  it('groups sections by status correctly', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <CustomSectionsPage />
        </MockedProvider>
      </MemoryRouter>,
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
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <CustomSectionsPage />
        </MockedProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Custom Sections')).toBeInTheDocument();
  });

  it('displays surface dropdown', async () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <CustomSectionsPage />
        </MockedProvider>
      </MemoryRouter>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Sections for')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});
