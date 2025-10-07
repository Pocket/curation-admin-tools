import {
  Section,
  SectionStatus,
  ActivitySource,
  SectionItem,
  ApprovedCorpusItem,
  CorpusLanguage,
  CorpusItemSource,
  CuratedStatus,
} from '../../api/generatedTypes';
import { getSectionsWithSectionItems } from '../../api/queries/getSectionsWithSectionItems';
import { constructMock } from './utils';
import { DateTime } from 'luxon';

/**
 * Mock approved items for section items
 */
const mockApprovedItem1: ApprovedCorpusItem = {
  externalId: 'approved-1',
  prospectId: 'prospect-1',
  title: 'Test Article 1',
  url: 'https://example.com/article1',
  hasTrustedDomain: true,
  imageUrl: 'https://example.com/image1.jpg',
  excerpt: 'This is a test article excerpt 1',
  authors: [{ name: 'Author 1', sortOrder: 1 }],
  publisher: 'Publisher 1',
  datePublished: '2024-01-15',
  language: CorpusLanguage.En,
  topic: 'TECHNOLOGY',
  status: CuratedStatus.Corpus,
  source: CorpusItemSource.Manual,
  isCollection: false,
  isTimeSensitive: false,
  isSyndicated: false,
  createdBy: 'test-user',
  createdAt: 1705276800,
  updatedAt: 1705276800,
  scheduledSurfaceHistory: [],
};

const mockApprovedItem2: ApprovedCorpusItem = {
  externalId: 'approved-2',
  prospectId: 'prospect-2',
  title: 'Test Article 2',
  url: 'https://example.com/article2',
  hasTrustedDomain: true,
  imageUrl: 'https://example.com/image2.jpg',
  excerpt: 'This is a test article excerpt 2',
  authors: [{ name: 'Author 2', sortOrder: 1 }],
  publisher: 'Publisher 2',
  datePublished: '2024-01-16',
  language: CorpusLanguage.En,
  topic: 'SCIENCE',
  status: CuratedStatus.Corpus,
  source: CorpusItemSource.Manual,
  isCollection: false,
  isTimeSensitive: false,
  isSyndicated: false,
  createdBy: 'test-user',
  createdAt: 1705363200,
  updatedAt: 1705363200,
  scheduledSurfaceHistory: [],
};

/**
 * Mock section items for testing
 */
const mockSectionItems: SectionItem[] = [
  {
    externalId: 'item-1',
    approvedItem: mockApprovedItem1,
    createdAt: 1705276800,
    updatedAt: 1705276800,
  },
  {
    externalId: 'item-2',
    approvedItem: mockApprovedItem2,
    createdAt: 1705363200,
    updatedAt: 1705363200,
  },
];

/**
 * Helper to create a section with specified status and dates
 */
const createSection = (
  id: string,
  title: string,
  status: SectionStatus,
  startDate: string | null = null,
  endDate: string | null = null,
  createSource: ActivitySource = ActivitySource.Manual,
  sectionItems: SectionItem[] = [],
): Section => ({
  externalId: id,
  title,
  scheduledSurfaceGuid: 'NEW_TAB_EN_US',
  iab: {
    taxonomy: 'v2.0',
    categories: ['Technology', 'Science'],
  },
  sort: 1,
  createSource,
  disabled: false,
  active: true,
  description: `Description for ${title}`,
  heroTitle: `Hero ${title}`,
  heroDescription: `Hero description for ${title}`,
  startDate,
  endDate,
  status,
  sectionItems,
  createdAt: 1704067200,
  updatedAt: 1704067200,
});

/**
 * Test data for various section states
 */
const now = DateTime.now();
const futureDate = now.plus({ days: 7 }).toISO();
const pastDate = now.minus({ days: 7 }).toISO();
const farPastDate = now.minus({ days: 30 }).toISO();

export const mockSections: Section[] = [
  // Scheduled sections (future start date)
  createSection(
    'scheduled-1',
    'Scheduled Section 1',
    SectionStatus.Scheduled,
    futureDate,
    null,
    ActivitySource.Manual,
    mockSectionItems,
  ),
  createSection(
    'scheduled-2',
    'Scheduled Section 2',
    SectionStatus.Scheduled,
    now.plus({ days: 14 }).toISO(),
    null,
    ActivitySource.Manual,
    [],
  ),

  // Live sections (current date between start and end)
  createSection(
    'live-1',
    'Live Section 1',
    SectionStatus.Live,
    pastDate,
    now.plus({ days: 3 }).toISO(),
    ActivitySource.Manual,
    mockSectionItems,
  ),
  createSection(
    'live-2',
    'Live Section 2',
    SectionStatus.Live,
    farPastDate,
    null,
    ActivitySource.Manual,
    [],
  ),
  createSection(
    'live-3',
    'Live Section No End',
    SectionStatus.Live,
    pastDate,
    null,
    ActivitySource.Manual,
    mockSectionItems,
  ),

  // Expired sections (past end date)
  createSection(
    'expired-1',
    'Expired Section 1',
    SectionStatus.Disabled,
    farPastDate,
    pastDate,
    ActivitySource.Manual,
    [],
  ),
  createSection(
    'expired-2',
    'Expired Section 2',
    SectionStatus.Disabled,
    farPastDate,
    now.minus({ days: 1 }).toISO(),
    ActivitySource.Manual,
    mockSectionItems,
  ),

  // ML sections (should be filtered out)
  createSection(
    'ml-1',
    'ML Section 1',
    SectionStatus.Live,
    pastDate,
    null,
    ActivitySource.Ml,
    [],
  ),
  createSection(
    'ml-2',
    'ML Section 2',
    SectionStatus.Scheduled,
    futureDate,
    null,
    ActivitySource.Ml,
    [],
  ),
];

/**
 * Mock for all sections (NEW_TAB_EN_US)
 */
export const mock_AllSections = constructMock(
  'searchSectionsWithSectionItems',
  getSectionsWithSectionItems,
  {
    scheduledSurfaceGuid: 'NEW_TAB_EN_US',
    limit: 100,
    offset: 0,
  },
  {
    totalResults: mockSections.length,
    sections: mockSections,
  },
);

/**
 * Mock for NEW_TAB_DE_DE surface
 */
export const mock_GermanSections = constructMock(
  'searchSectionsWithSectionItems',
  getSectionsWithSectionItems,
  {
    scheduledSurfaceGuid: 'NEW_TAB_DE_DE',
    limit: 100,
    offset: 0,
  },
  {
    totalResults: 2,
    sections: [
      createSection(
        'de-1',
        'German Section 1',
        SectionStatus.Live,
        pastDate,
        null,
        ActivitySource.Manual,
        [],
      ),
      createSection(
        'de-2',
        'German Section 2',
        SectionStatus.Scheduled,
        futureDate,
        null,
        ActivitySource.Manual,
        [],
      ),
    ],
  },
);

/**
 * Mock for empty results
 */
export const mock_EmptySections = constructMock(
  'searchSectionsWithSectionItems',
  getSectionsWithSectionItems,
  {
    scheduledSurfaceGuid: 'NEW_TAB_EN_US',
    limit: 100,
    offset: 0,
  },
  {
    totalResults: 0,
    sections: [],
  },
);

/**
 * Mock for sections with undefined status (fallback logic test)
 */
export const mock_UndefinedStatusSections = constructMock(
  'searchSectionsWithSectionItems',
  getSectionsWithSectionItems,
  {
    scheduledSurfaceGuid: 'NEW_TAB_EN_US',
    limit: 100,
    offset: 0,
  },
  {
    totalResults: 3,
    sections: [
      {
        ...createSection(
          'undefined-1',
          'Future Section Without Status',
          SectionStatus.Live,
          futureDate,
          null,
        ),
        status: undefined,
      },
      {
        ...createSection(
          'undefined-2',
          'Active Section Without Status',
          SectionStatus.Live,
          pastDate,
          null,
        ),
        status: undefined,
        active: true,
      },
      {
        ...createSection(
          'undefined-3',
          'Inactive Section Without Status',
          SectionStatus.Disabled,
          pastDate,
          null,
        ),
        status: undefined,
        active: false,
        disabled: true,
      },
    ],
  },
);

/**
 * Mock for error response
 */
export const mock_SectionsError = {
  request: {
    query: getSectionsWithSectionItems,
    variables: {
      scheduledSurfaceGuid: 'NEW_TAB_EN_US',
      limit: 100,
      offset: 0,
    },
  },
  error: new Error('Failed to fetch sections'),
};
