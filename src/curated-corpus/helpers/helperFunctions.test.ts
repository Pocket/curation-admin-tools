import {
  CuratedStatus,
  Prospect,
  ProspectType,
} from '../../api/generatedTypes';
import {
  fetchFileFromUrl,
  transformProspectToApprovedItem,
} from './helperFunctions';

describe('helperFunctions ', () => {
  describe('transformProspectToApprovedItem function', () => {
    it('should create an ApprovedCuratedCorpusItem with all the provided fields', () => {
      const prospect: Prospect = {
        id: 'test-prospect-id',
        scheduledSurfaceGuid: 'en-us',
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
        scheduledSurfaceGuid: 'en-us',
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
});
