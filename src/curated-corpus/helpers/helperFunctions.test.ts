import {
  //ApprovedCuratedCorpusItem,
  CuratedStatus,
  ProspectType,
} from '../api/curated-corpus-api/generatedTypes';
import { Prospect } from '../api/prospect-api/generatedTypes';
import { transformProspectToApprovedItem } from './helperFunctions';
//import

describe('helperFunctions ', () => {
  describe('transformProspectToApprovedItem function', () => {
    it('should create an ApprovedCuratedCorpusItem with all the provided fields', () => {
      const prospect: Prospect = {
        id: 'test-prospect-id',
        newTab: 'en-us',
        prospectType: ProspectType.Syndicated,
        url: 'test-prospect-url',
        createdAt: 20220110,
        domain: 'test-prospect-domain',
        excerpt: 'test-prospect-excerpt',
        imageUrl: 'test-prospect-image-url',
        isCollection: true,
        isSyndicated: true,
        language: 'en',
        publisher: 'test-prospect-publisher',
        saveCount: 10,
        title: 'test-prospect-title',
        topic: 'test-prospect-topic',
      };

      const approvedItemFromProspect = transformProspectToApprovedItem(
        prospect,
        true
      );

      expect(approvedItemFromProspect).toMatchObject({
        externalId: '',
        prospectId: prospect.id,
        url: prospect.url,
        title: prospect.title,
        imageUrl: prospect.imageUrl,
        publisher: prospect.publisher,
        language: prospect.language,
        topic: prospect.topic,
        status: CuratedStatus.Recommendation,
        isTimeSensitive: false,
        isSyndicated: prospect.isSyndicated,
        isCollection: prospect.isCollection,
        excerpt: prospect.excerpt,
        createdAt: prospect.createdAt,
        createdBy: '',
        updatedAt: 0,
      });
    });

    it('should create an ApprovedCuratedCorpusItem with the default fields when only required fields are provided', () => {
      const prospect: Prospect = {
        id: 'test-prospect-id',
        url: 'test-prospect-url',
        newTab: 'en-us',
        prospectType: ProspectType.Global,
      };

      const approvedItemFromProspect = transformProspectToApprovedItem(
        prospect,
        false
      );

      expect(approvedItemFromProspect).toMatchObject({
        externalId: '',
        prospectId: prospect.id,
        url: prospect.url,
        title: '',
        imageUrl: '',
        publisher: '',
        language: '',
        topic: '',
        status: CuratedStatus.Corpus,
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

  describe('fetchFileFromUrl', () => {
    beforeEach(() => {
      // jest.spyOn(global, 'fetch').mockResolvedValue({
      //   json: jest.fn().mockResolvedValue(mockResponse),
      // });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    //it('does the test', async () => {});
  });
});
