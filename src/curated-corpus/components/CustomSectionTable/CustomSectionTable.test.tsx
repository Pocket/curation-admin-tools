import React from 'react';
import { ActivitySource, SectionStatus } from '../../../api/generatedTypes';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomSectionTable } from './CustomSectionTable';
import { Section } from '../../../api/generatedTypes';
import { MemoryRouter } from 'react-router-dom';

// Mock useHistory
const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockPush,
  }),
}));

describe('CustomSectionTable', () => {
  const mockSection: Section = {
    __typename: 'Section',
    externalId: 'test-section-1',
    title: 'Test Section',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T00:00:00Z',
    active: true,
    status: SectionStatus.Live,
    createSource: ActivitySource.Manual,
    disabled: false,
    sectionItems: [],
    createdAt: 1704067200,
    updatedAt: 1704067200,
    scheduledSurfaceGuid: 'NEW_TAB_EN_US',
    followable: true,
    allowAds: true,
  };

  const mockSectionScheduled: Section = {
    ...mockSection,
    externalId: 'test-section-2',
    title: 'Scheduled Section',
    status: SectionStatus.Scheduled,
  };

  const mockSectionExpired: Section = {
    ...mockSection,
    externalId: 'test-section-3',
    title: 'Expired Section',
    status: SectionStatus.Expired,
    active: false,
  };

  const mockSectionDisabled: Section = {
    ...mockSection,
    externalId: 'test-section-4',
    title: 'Disabled Section',
    status: SectionStatus.Disabled,
    disabled: true,
    active: false,
  };

  it('returns null when sections array is empty', () => {
    const { container } = render(
      <CustomSectionTable title="Test Title" sections={[]} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders table with title when sections are provided', () => {
    render(
      <CustomSectionTable title="Live Sections" sections={[mockSection]} />,
    );

    expect(screen.getByText('Live Sections')).toBeInTheDocument();
    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('displays formatted dates correctly', () => {
    render(<CustomSectionTable title="Test" sections={[mockSection]} />);

    expect(screen.getByText('Jan 01, 2024')).toBeInTheDocument();
    expect(screen.getByText('Dec 31, 2024')).toBeInTheDocument();
  });

  it('displays dash for missing dates', () => {
    const sectionWithoutDates: Section = {
      ...mockSection,
      startDate: null,
      endDate: null,
    };

    render(
      <CustomSectionTable title="Test" sections={[sectionWithoutDates]} />,
    );

    const dashes = screen.getAllByText('-');
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });

  it('displays correct status chips', () => {
    render(
      <CustomSectionTable
        title="All Sections"
        sections={[
          mockSection,
          mockSectionScheduled,
          mockSectionExpired,
          mockSectionDisabled,
        ]}
      />,
    );

    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(screen.getByText('Scheduled')).toBeInTheDocument();
    expect(screen.getByText('Expired')).toBeInTheDocument();
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  it('renders multiple sections correctly', () => {
    const sections = [mockSection, mockSectionScheduled, mockSectionExpired];

    render(
      <CustomSectionTable title="Multiple Sections" sections={sections} />,
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Scheduled Section')).toBeInTheDocument();
    expect(screen.getByText('Expired Section')).toBeInTheDocument();
  });

  it('displays table headers correctly', () => {
    render(<CustomSectionTable title="Test" sections={[mockSection]} />);

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('End')).toBeInTheDocument();
    expect(screen.getByText('Items')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('displays item count correctly', () => {
    const sectionWithItems: Section = {
      ...mockSection,
      sectionItems: [
        {
          __typename: 'SectionItem',
          externalId: '1',
          approvedItem: {} as any,
          createdAt: 1704067200,
          updatedAt: 1704067200,
        },
        {
          __typename: 'SectionItem',
          externalId: '2',
          approvedItem: {} as any,
          createdAt: 1704067200,
          updatedAt: 1704067200,
        },
      ],
    };

    render(<CustomSectionTable title="Test" sections={[sectionWithItems]} />);

    expect(screen.getByText('2 items')).toBeInTheDocument();
  });

  it('displays "No items" in red when section has no items', () => {
    render(<CustomSectionTable title="Test" sections={[mockSection]} />);

    const noItemsText = screen.getByText('No items');
    expect(noItemsText).toBeInTheDocument();
    expect(noItemsText).toHaveStyle('font-weight: 500');
  });

  it('displays singular "item" when count is 1', () => {
    const sectionWithOneItem: Section = {
      ...mockSection,
      sectionItems: [
        {
          __typename: 'SectionItem',
          externalId: '1',
          approvedItem: {} as any,
          createdAt: 1704067200,
          updatedAt: 1704067200,
        },
      ],
    };

    render(<CustomSectionTable title="Test" sections={[sectionWithOneItem]} />);

    expect(screen.getByText('1 item')).toBeInTheDocument();
  });

  it('displays warning text for Live sections', () => {
    render(<CustomSectionTable title="Live" sections={[mockSection]} />);

    expect(
      screen.getByText(
        '* Sections without items will not be displayed on New Tab',
      ),
    ).toBeInTheDocument();
  });

  it('does not display warning text for non-Live sections', () => {
    render(<CustomSectionTable title="Scheduled" sections={[mockSection]} />);

    expect(
      screen.queryByText('* Sections without items will not be displayed'),
    ).not.toBeInTheDocument();
  });

  it('navigates on row click when scheduledSurfaceGuid is provided', () => {
    render(
      <MemoryRouter>
        <CustomSectionTable
          title="Test"
          sections={[mockSection]}
          scheduledSurfaceGuid="NEW_TAB_EN_US"
        />
      </MemoryRouter>,
    );

    const row = screen.getByText('Test Section').closest('tr');
    fireEvent.click(row!);

    expect(mockPush).toHaveBeenCalledWith(
      '/curated-corpus/custom-sections/test-section-1/NEW_TAB_EN_US/',
    );
  });

  it('does not navigate on row click when scheduledSurfaceGuid is not provided', () => {
    render(
      <MemoryRouter>
        <CustomSectionTable title="Test" sections={[mockSection]} />
      </MemoryRouter>,
    );

    const row = screen.getByText('Test Section').closest('tr');
    expect(row).toHaveStyle('cursor: default');
  });

  it('displays live indicator dot for live sections', () => {
    render(<CustomSectionTable title="Test" sections={[mockSection]} />);

    const titleCell = screen.getByText('Test Section').closest('td');
    const indicator = titleCell?.querySelector('div > div:last-child');
    expect(indicator).toHaveStyle('border-radius: 50%');
  });
});
