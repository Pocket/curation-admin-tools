import React from 'react';
import { render, screen } from '@testing-library/react';
import { CustomSectionTable } from './CustomSectionTable';
import { Section, SectionStatus } from '../../../api/generatedTypes';

describe('CustomSectionTable', () => {
  const mockSection: Section = {
    __typename: 'Section',
    externalId: 'test-section-1',
    title: 'Test Section',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T00:00:00Z',
    active: true,
    status: SectionStatus.Live,
    createSource: 'MANUAL',
    disabled: false,
    sectionItems: [],
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
    expect(screen.getByText('Status')).toBeInTheDocument();
  });
});
