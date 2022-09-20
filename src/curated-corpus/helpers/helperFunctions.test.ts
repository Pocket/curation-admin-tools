import { DateTime } from 'luxon';
import { ProspectType } from '../../api/generatedTypes';
import { ScheduledSurfaces } from './definitions';
import {
  fetchFileFromUrl,
  getCuratorNameFromLdap,
  getScheduledSurfaceName,
  getLocalDateTimeForGuid,
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

    it('should return the same input string when an invalid mozilla ldap string is provided', () => {
      // note that the input string has - instead of |
      expect(getCuratorNameFromLdap('ad-Mozilla-LDAP-jdoe')).toEqual(
        'ad-Mozilla-LDAP-jdoe'
      );
    });

    it('should return the same empty string when an empty string is provided', () => {
      expect(getCuratorNameFromLdap('')).toEqual('');
    });
  });

  describe('getScheduledSurfaceName function', () => {
    it('should return the correct scheduled surface name when its corresponding guid is provided', () => {
      expect(getScheduledSurfaceName(ScheduledSurfaces[0].guid)).toEqual(
        ScheduledSurfaces[0].name
      );
    });

    it('should return the same input guid string when an incorrect guid is provided', () => {
      expect(getScheduledSurfaceName('BOGUS_GUID')).toEqual('BOGUS_GUID');
    });
  });

  describe('getLocalDateTimeForGuid function', () => {
    const newTabEnUsSurface = {
      name: 'en-US',
      guid: 'NEW_TAB_EN_US',
      ianaTimezone: 'America/New_York',
      prospectTypes: [ProspectType.Global],
    };

    const mockGetScheduledSurfacesForUserQueryData = {
      getScheduledSurfacesForUser: [newTabEnUsSurface],
    };

    it('should return the correctly formatted local date time for the NEW_TAB_EN_US guid', () => {
      const dateTimeFromFunction = getLocalDateTimeForGuid(
        newTabEnUsSurface.guid,
        mockGetScheduledSurfacesForUserQueryData
      );

      const localDateTime = DateTime.local().setZone(
        newTabEnUsSurface.ianaTimezone
      );

      expect(dateTimeFromFunction).toEqual(
        localDateTime.toFormat('DDD').concat(', ', localDateTime.toFormat('t'))
      );
    });

    it('should return undefined for an incorrect guid', () => {
      const dateTimeFromFunction = getLocalDateTimeForGuid(
        'FAKE_GUID',
        mockGetScheduledSurfacesForUserQueryData
      );

      expect(dateTimeFromFunction).toEqual(undefined);
    });
  });
});
