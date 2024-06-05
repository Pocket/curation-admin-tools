import { expect } from 'chai';
import { expect as jestExpect } from '@jest/globals';
import {
  getProspectFilterOptions,
  transformProspectToApprovedItem,
  transformUrlMetaDataToProspect,
} from './prospects';
import {
  CorpusItemSource,
  CorpusLanguage,
  CuratedStatus,
  Prospect,
  ProspectType,
  UrlMetadata,
} from '../../api/generatedTypes';

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
      const types: ProspectType[] = [ProspectType.SyndicatedNew];

      const options = getProspectFilterOptions(types);

      // 1 prospect type + 1 'All Sources' option
      expect(options).to.have.lengthOf(2);

      expect(options[0].code).to.be.an.empty.string;
      expect(options[0].name).to.equal('All Sources');

      expect(options[1].code).to.equal(ProspectType.SyndicatedNew);
      expect(options[1].name).to.equal('SyndicatedNew');
    });
  });

  describe('transformProspectToApprovedItem function', () => {
    it('should create an ApprovedCorpusItem with all the provided fields', () => {
      const prospect: Prospect & { datePublished?: string | null } = {
        id: 'test-id',
        prospectId: 'test-prospect-id',
        scheduledSurfaceGuid: 'en-us',
        prospectType: ProspectType.SyndicatedNew,
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
});
