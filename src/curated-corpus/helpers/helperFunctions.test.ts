import { ScheduledSurfaces } from './definitions';
import {
  fetchFileFromUrl,
  getCuratorNameFromLdap,
  getScheduledSurfaceName,
} from './helperFunctions';

describe('helperFunctions ', () => {
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

  describe('getCuratorNameFromLdap function', () => {
    it('should return a curator name in jdoe format when a mozilla ldap string is provided', () => {
      expect(getCuratorNameFromLdap('ad|Mozilla-LDAP|jdoe')).toEqual('jdoe');
    });

    it('should return "invalid ldap string" when an invalid mozilla ldap string is provided', () => {
      expect(getCuratorNameFromLdap('ad-Mozilla-LDAP-jdoe')).toEqual(
        'invalid ldap string'
      );
    });

    it('should return "invalid ldap string" string when an empty string is provided', () => {
      expect(getCuratorNameFromLdap('')).toEqual('invalid ldap string');
    });
  });

  describe('getScheduledSurfaceName function', () => {
    it('should return the correct scheduled surface name when its corresponding guid is provided', () => {
      expect(getScheduledSurfaceName(ScheduledSurfaces[0].guid)).toEqual(
        ScheduledSurfaces[0].name
      );
    });

    it('should return "invalid surface" string when an incorrect guid is provided', () => {
      expect(getScheduledSurfaceName('BOGUS_GUID')).toEqual('invalid surface');
    });
  });
});
