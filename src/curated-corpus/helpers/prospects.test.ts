import { expect } from 'chai';
import { expect as jestExpect } from '@jest/globals';
import {
  getFilteredProspects,
  getProspectFilterOptions,
  transformProspectToApprovedItem,
  transformUrlMetaDataToProspect,
} from './prospects';
import {
  ApprovedCorpusItem,
  CorpusItemSource,
  CorpusLanguage,
  CuratedStatus,
  Prospect,
  ProspectType,
  Topics,
  UrlMetadata,
} from '../../api/generatedTypes';
import { DateTime } from 'luxon';

describe('helper functions related to prospects', () => {
  describe('getProspectFilterOptions function', () => {
    it('returns just the "All Sources" option if no prospect types are available', () => {
      const types: ProspectType[] = [];

      const options = getProspectFilterOptions(types);

      expect(options).to.have.lengthOf(1);
      expect(options[0].code).to.be.an.empty.string;
      expect(options[0].name).to.equal('All Sources');
    });

    it('returns all available options if all are present for given Scheduled Surface', () => {
      const types: ProspectType[] = Object.values(ProspectType);

      const options = getProspectFilterOptions(types);

      // all prospect types + 1 'All Sources' option
      expect(options).to.have.lengthOf(Object.values(ProspectType).length + 1);

      // first option should be 'All Sources'
      expect(options[0].code).to.be.an.empty.string;
      expect(options[0].name).to.equal('All Sources');
    });

    it('returns a cut-down list of prospect types if only some are available for given Scheduled Surface', () => {
      const types: ProspectType[] = [ProspectType.Recommended];

      const options = getProspectFilterOptions(types);

      // 1 prospect type + 1 'All Sources' option
      expect(options).to.have.lengthOf(2);

      expect(options[0].code).to.be.an.empty.string;
      expect(options[0].name).to.equal('All Sources');

      expect(options[1].code).to.equal(ProspectType.Recommended);
      expect(options[1].name).to.equal('Recommended');
    });
  });

  describe('transformProspectToApprovedItem function', () => {
    it('should create an ApprovedCorpusItem with all the provided fields', () => {
      const prospect: Prospect & { datePublished?: string | null } = {
        id: 'test-id',
        prospectId: 'test-prospect-id',
        scheduledSurfaceGuid: 'en-us',
        prospectType: ProspectType.Recommended,
        url: 'test-prospect-url',
        createdAt: 20220110,
        domain: 'test-prospect-domain',
        excerpt: 'test-prospect-excerpt',
        imageUrl: 'test-prospect-image-url',
        isCollection: true,
        isSyndicated: true,
        language: CorpusLanguage.En,
        publisher: 'test-prospect-publisher',
        datePublished: '2024-01-01',
        saveCount: 10,
        title: 'test-prospect-title',
        topic: 'test-prospect-topic',
      };

      const approvedItemFromProspect = transformProspectToApprovedItem(
        prospect,
        true,
        true,
      );

      jestExpect(approvedItemFromProspect).toMatchObject({
        externalId: '',
        prospectId: prospect.prospectId,
        url: prospect.url,
        title: prospect.title,
        imageUrl: prospect.imageUrl,
        publisher: prospect.publisher,
        datePublished: prospect.datePublished,
        language: CorpusLanguage.En,
        topic: prospect.topic,
        status: CuratedStatus.Recommendation,
        source: CorpusItemSource.Manual,
        isTimeSensitive: false,
        isSyndicated: prospect.isSyndicated,
        isCollection: prospect.isCollection,
        excerpt: prospect.excerpt,
        createdAt: prospect.createdAt,
        createdBy: '',
        updatedAt: 0,
      });
    });

    it('should create an ApprovedCorpusItem with the default fields when only required fields are provided', () => {
      const prospect: Prospect = {
        id: 'test-prospect-id',
        url: 'test-prospect-url',
        prospectId: 'test-prospect-id',
        scheduledSurfaceGuid: 'en-us',
        prospectType: ProspectType.Recommended,
      };

      const approvedItemFromProspect = transformProspectToApprovedItem(
        prospect,
        false,
        true,
      );

      jestExpect(approvedItemFromProspect).toMatchObject({
        externalId: '',
        prospectId: prospect.id,
        url: prospect.url,
        title: '',
        imageUrl: '',
        publisher: '',
        datePublished: null,
        language: undefined,
        topic: '',
        status: CuratedStatus.Corpus,
        source: CorpusItemSource.Manual,
        isTimeSensitive: false,
        isSyndicated: false,
        isCollection: false,
        excerpt: '',
        createdAt: 0,
        createdBy: '',
        updatedAt: 0,
      });
    });
  });

  describe('transformUrlMetaDataToProspect function', () => {
    const urlMetadata: UrlMetadata = { url: 'www.test-url.com' };
    const defaultExpectedProspect: Prospect & {
      datePublished?: string | null;
    } = {
      id: '',
      prospectId: '',
      url: urlMetadata.url,
      title: '',
      imageUrl: '',
      authors: '',
      publisher: '',
      datePublished: null,
      language: undefined,
      isSyndicated: false,
      isCollection: false,
      excerpt: '',
      topic: '',
      prospectType: '',
      scheduledSurfaceGuid: '',
    };

    it('should return the default values when metadata is lacking most of the fields', () => {
      const prospect = transformUrlMetaDataToProspect(urlMetadata);

      expect(prospect).to.deep.equal(defaultExpectedProspect);
    });

    it('should return correctly formatted prospect with values derived from the metadata', () => {
      const metaDataWithPopulatedFields: UrlMetadata = {
        ...urlMetadata,
        title: 'test title',
        imageUrl: 'www.test-image-url.com',
        authors: 'test author A, test author B',
        publisher: 'test publisher',
        language: 'en',
        isSyndicated: true,
        isCollection: true,
        excerpt: 'test excerpt',
      };

      const prospect = transformUrlMetaDataToProspect(
        metaDataWithPopulatedFields,
      );

      expect(prospect).to.deep.equal({
        ...defaultExpectedProspect,
        url: metaDataWithPopulatedFields.url,
        title: metaDataWithPopulatedFields.title,
        imageUrl: metaDataWithPopulatedFields.imageUrl,
        authors: metaDataWithPopulatedFields.authors,
        publisher: metaDataWithPopulatedFields.publisher,
        language: CorpusLanguage.En,
        isSyndicated: true,
        isCollection: true,
        excerpt: metaDataWithPopulatedFields.excerpt,
      });
    });

    it.each`
      languageCode | expectedLanguage
      ${'de'}      | ${CorpusLanguage.De}
      ${'en'}      | ${CorpusLanguage.En}
      ${'es'}      | ${CorpusLanguage.Es}
      ${'fr'}      | ${CorpusLanguage.Fr}
      ${'it'}      | ${CorpusLanguage.It}
    `(
      'should transform $languageCode from the metadata as $expectedLanguage',
      ({ languageCode, expectedLanguage }) => {
        const metaDataWithLanguage = {
          ...urlMetadata,
          language: languageCode,
        };

        const prospect = transformUrlMetaDataToProspect(metaDataWithLanguage);

        expect(prospect).to.deep.equal({
          ...defaultExpectedProspect,
          language: expectedLanguage,
        });
      },
    );
  });

  describe('getFilteredProspects', () => {
    const currentDate = DateTime.local();
    const twoWeeksBefore = currentDate.minus({ days: 14 });
    const fifteenDaysAfter = currentDate.plus({ days: 15 });

    const initialProspects: Prospect[] = [
      {
        id: '123-abc',
        prospectId: '456-dfg',
        title: 'How To Win Friends And Influence People with DynamoDB',
        scheduledSurfaceGuid: 'NEW_TAB_EN_US',
        prospectType: 'organic-timespent',
        url: 'http://www.test.com/how-to',
        imageUrl: 'https://placeimg.com/640/480/people?random=495',
        excerpt:
          'Everything You Wanted to Know About DynamoDB and Were Afraid To Ask',
        language: CorpusLanguage.En,
        publisher: 'Amazing Inventions',
        authors: 'Charles Dickens,O. Henry',
        topic: Topics.Technology,
        saveCount: 111222,
        isSyndicated: false,
      },
      {
        id: '456-def',
        prospectId: '123-bc',
        title:
          'How We Discovered That People Who Are Colorblind Are Less Likely to Be Picky Eaters',
        scheduledSurfaceGuid: 'NEW_TAB_EN_US',
        prospectType: 'organic-timespent',
        url: 'http://www.test.com/how-to',
        imageUrl: 'https://placeimg.com/640/480/people?random=495',
        excerpt:
          'The seventh season of Julia Child’s “The French Chef,” the first of the television series to air in color, revealed how color can change the experience of food.',
        language: CorpusLanguage.En,
        publisher: 'The Conversation',
        authors: 'Jason Parham',
        topic: Topics.Food,
        saveCount: 111222,
        isSyndicated: false,
      },
    ];

    let prospects: Prospect[];

    beforeEach(() => {
      // Deep copy the initial prospects array before each test
      prospects = JSON.parse(JSON.stringify(initialProspects));
    });

    it('should return an empty array when input array is empty', () => {
      const result = getFilteredProspects([], 'test', false);
      expect(result.length).to.equal(0);
    });

    it('should exclude prospects with rejectedCorpusItem', () => {
      prospects[0].rejectedCorpusItem = {
        externalId: '123-abc',
        reason: 'reason',
        url: 'http://www.test.com/how-to',
        createdAt: Date.now(),
        createdBy: 'test-user',
      };
      const result = getFilteredProspects(prospects, 'Test', false);
      expect(result.length).to.equal(0);
    });

    it('should include prospects when filterByPublisher matches and excludePublisherSwitch is false', () => {
      const result = getFilteredProspects(
        prospects,
        'Amazing Inventions',
        false,
      );
      expect(result).to.deep.equal([prospects[0]]);
    });

    it('should exclude prospects when filterByPublisher matches and excludePublisherSwitch is true', () => {
      const result = getFilteredProspects(
        prospects,
        'Amazing Inventions',
        true,
      );
      expect(result).to.deep.equal([prospects[1]]);
    });

    it('should include prospects when filterByPublisher does not match and excludePublisherSwitch is true', () => {
      const result = getFilteredProspects(prospects, 'Other', true);
      expect(result).to.deep.equal(prospects);
    });

    it('should exclude prospects with an approvedCorpusItem scheduled within 14 days before and after today', () => {
      prospects[0].approvedCorpusItem = {
        externalId: '123-abc',
        createdBy: 'test-user',
        hasTrustedDomain: true,
        isTimeSensitive: false,
        source: CorpusItemSource.Manual,
        status: CuratedStatus.Recommendation,
        updatedAt: currentDate.millisecond,
        scheduledSurfaceHistory: [
          {
            externalId: '123-abc',
            scheduledDate: currentDate.toISO(),
            createdBy: 'test-user',
            scheduledSurfaceGuid: 'NEW_TAB_EN_US',
          },
        ],
      } as ApprovedCorpusItem;
      const result = getFilteredProspects(
        prospects,
        'Amazing Inventions',
        false,
      );
      expect(result).to.deep.equal([]);
    });

    it('should include prospects with an approvedCorpusItem scheduled outside the 14 days window', () => {
      prospects[0].approvedCorpusItem = {
        externalId: '123-abc',
        createdBy: 'test-user',
        hasTrustedDomain: true,
        isTimeSensitive: false,
        source: CorpusItemSource.Manual,
        status: CuratedStatus.Recommendation,
        updatedAt: currentDate.millisecond,
        scheduledSurfaceHistory: [
          {
            externalId: '123-abc',
            scheduledDate: twoWeeksBefore.minus({ days: 1 }).toISO(),
            createdBy: 'test-user',
            scheduledSurfaceGuid: 'NEW_TAB_EN_US',
          },
        ],
      } as ApprovedCorpusItem;
      const result = getFilteredProspects(
        prospects,
        'Amazing Inventions',
        false,
      );
      expect(result).to.deep.equal([prospects[0]]);
    });

    it('should include prospects with no scheduledSurfaceHistory', () => {
      prospects[0].approvedCorpusItem = {
        externalId: '123-abc',
        createdBy: 'test-user',
        hasTrustedDomain: true,
        isTimeSensitive: false,
        source: CorpusItemSource.Manual,
        status: CuratedStatus.Recommendation,
        updatedAt: currentDate.millisecond,
        scheduledSurfaceHistory: [],
      } as unknown as ApprovedCorpusItem;

      const result = getFilteredProspects(
        prospects,
        'Amazing Inventions',
        false,
      );
      expect(result).to.deep.equal([prospects[0]]);
    });

    it('should handle prospects with future (15 days) scheduled dates correctly', () => {
      prospects[0].approvedCorpusItem = {
        externalId: '123-abc',
        createdBy: 'test-user',
        hasTrustedDomain: true,
        isTimeSensitive: false,
        source: CorpusItemSource.Manual,
        status: CuratedStatus.Recommendation,
        updatedAt: currentDate.millisecond,
        scheduledSurfaceHistory: [
          {
            externalId: '123-abc',
            scheduledDate: fifteenDaysAfter.toISO(),
            createdBy: 'test-user',
            scheduledSurfaceGuid: 'NEW_TAB_EN_US',
          },
        ],
      } as ApprovedCorpusItem;
      const result = getFilteredProspects(
        prospects,
        'Amazing Inventions',
        false,
      );
      expect(result).to.deep.equal([prospects[0]]);
    });

    it('should handle prospects with past scheduled dates beyond 14 days window', () => {
      prospects[0].approvedCorpusItem = {
        externalId: '123-abc',
        createdBy: 'test-user',
        hasTrustedDomain: true,
        isTimeSensitive: false,
        source: CorpusItemSource.Manual,
        status: CuratedStatus.Recommendation,
        updatedAt: currentDate.millisecond,
        scheduledSurfaceHistory: [
          {
            externalId: '123-abc',
            scheduledDate: twoWeeksBefore.minus({ days: 1 }).toISO(),
            createdBy: 'test-user',
            scheduledSurfaceGuid: 'NEW_TAB_EN_US',
          },
        ],
      } as ApprovedCorpusItem;
      const result = getFilteredProspects(
        prospects,
        'Amazing Inventions',
        false,
      );
      expect(result).to.deep.equal([prospects[0]]);
    });

    it('should not apply filter when filterByPublisher length is 2 or less', () => {
      const result = getFilteredProspects(prospects, 'Am', false);
      expect(result).to.deep.equal(prospects);
    });
  });
});
