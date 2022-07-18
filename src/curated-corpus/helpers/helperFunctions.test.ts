import {
  CorpusItemSource,
  CorpusLanguage,
  CuratedStatus,
  Prospect,
  ProspectType,
  Topics,
} from '../../api/generatedTypes';
import {
  fetchFileFromUrl,
  getDisplayTopic,
  transformProspectToApprovedItem,
} from './helperFunctions';

describe('helperFunctions ', () => {
  describe('transformProspectToApprovedItem function', () => {
    it('should create an ApprovedCorpusItem with all the provided fields', () => {
      const prospect: Prospect = {
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
        saveCount: 10,
        title: 'test-prospect-title',
        topic: 'test-prospect-topic',
      };

      const approvedItemFromProspect = transformProspectToApprovedItem(
        prospect,
        true,
        true
      );

      expect(approvedItemFromProspect).toMatchObject({
        externalId: '',
        prospectId: prospect.prospectId,
        url: prospect.url,
        title: prospect.title,
        imageUrl: prospect.imageUrl,
        publisher: prospect.publisher,
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
        prospectType: ProspectType.Global,
      };

      const approvedItemFromProspect = transformProspectToApprovedItem(
        prospect,
        false,
        true
      );

      expect(approvedItemFromProspect).toMatchObject({
        externalId: '',
        prospectId: prospect.id,
        url: prospect.url,
        title: '',
        imageUrl: '',
        publisher: '',
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

  describe('fetchFileFromUrl function', () => {
    const mockBlob = new Blob(['test'], { type: 'image/png' });
    const originalFetch = global.fetch;
    const mockResponse = new Response();

    // reset the global fetch to the original one
    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('should return the correct blob when fetch response is OK', async () => {
      // mocking the fetch response
      // this is replacing the global object's fetch with a jest mock function
      global.fetch = jest.fn(() => {
        return Promise.resolve({
          ...mockResponse,
          blob: () => {
            return Promise.resolve(mockBlob);
          },
        });
      });

      const responseBlob = await fetchFileFromUrl('www.test.com/image');

      // assert blob has correct file type
      expect(responseBlob?.type).toEqual('image/png');
    });

    it('should return undefined when fetch response is NOT OK', async () => {
      global.fetch = jest.fn(() => {
        return Promise.resolve({
          ...mockResponse,
          ok: false,
          blob: () => {
            return Promise.resolve(mockBlob);
          },
        });
      });

      const responseBlob = await fetchFileFromUrl('www.test.com/image');

      // assert blob has is undefined
      expect(responseBlob).toEqual(undefined);
    });
  });

  describe('getDisplayTopic function', () => {
    it('returns a capitalised display name for a one-word topic', () => {
      const displayTopic = getDisplayTopic(Topics.Technology);
      expect(displayTopic).toEqual('Technology');
    });

    it('returns a capitalised display name for a multiple-word topic', () => {
      const displayTopic = getDisplayTopic(Topics.HealthFitness);
      expect(displayTopic).toEqual('Health & Fitness');
    });

    it('returns "N/A" if topic is undefined', () => {
      const displayTopic = getDisplayTopic(undefined);
      expect(displayTopic).toEqual('N/A');
    });

    it('returns "N/A" if topic is not part of shared data topic list', () => {
      const displayTopic = getDisplayTopic('BEST_BOOKS');
      expect(displayTopic).toEqual('N/A');
    });
  });
});
