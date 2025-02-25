import React from 'react';
import { render, screen } from '@testing-library/react';
import { SectionDetails } from './SectionDetails';
import {
  ActivitySource,
  ApprovedCorpusItem,
  Section,
} from '../../../api/generatedTypes';
import { getTestApprovedItem } from '../../helpers/approvedItem';

describe('The SectionDetails component', () => {
  const item: ApprovedCorpusItem = getTestApprovedItem();
  const mockSections: Section[] = [
    {
      externalId: '1',
      title: 'Section 1',
      active: true,
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
    {
      externalId: '2',
      title: 'Section 2',
      active: false,
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

  it('should render all sections when currentSection is "all"', () => {
    render(
      <SectionDetails
        sections={mockSections}
        currentSection="all"
        currentScheduledSurfaceGuid="NEW_TAB_EN_US"
      />,
    );

    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
  });

  it('should render only the selected section', () => {
    render(
      <SectionDetails
        sections={mockSections}
        currentSection="Section 1"
        currentScheduledSurfaceGuid="NEW_TAB_EN_US"
      />,
    );

    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.queryByText('Section 2')).not.toBeInTheDocument();
  });

  it('should not render sections when there are no matching sections', () => {
    render(
      <SectionDetails
        sections={mockSections}
        currentSection="section-does-not-exist"
        currentScheduledSurfaceGuid="NEW_TAB_EN_US"
      />,
    );

    expect(screen.queryByText('Section 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Section 2')).not.toBeInTheDocument();
  });
});
