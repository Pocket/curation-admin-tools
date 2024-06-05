import { DateTime } from 'luxon';
import { CorpusLanguage, ProspectType } from '../../api/generatedTypes';
import { ScheduledSurfaces } from './definitions';
import {
  applyExcerptFormattingByLanguage,
  applyTitleFormattingByLanguage,
  downloadAndUploadApprovedItemImageToS3,
  fetchFileFromUrl,
  formatFormLabel,
  getCuratorNameFromLdap,
  getFormattedImageUrl,
  getLastScheduledDayDiff,
  getLocalDateTimeForGuid,
  getScheduledSurfaceName,
  readImageFileFromDisk,
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
        'ad-Mozilla-LDAP-jdoe',
      );
    });

    it('should return the same empty string when an empty string is provided', () => {
      expect(getCuratorNameFromLdap('')).toEqual('');
    });
  });

  describe('getScheduledSurfaceName function', () => {
    it('should return the correct scheduled surface name when its corresponding guid is provided', () => {
      expect(getScheduledSurfaceName(ScheduledSurfaces[0].guid)).toEqual(
        ScheduledSurfaces[0].name,
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
      prospectTypes: [ProspectType.Timespent],
    };

    const mockGetScheduledSurfacesForUserQueryData = {
      getScheduledSurfacesForUser: [newTabEnUsSurface],
    };

    it('should return the correctly formatted local date time for the NEW_TAB_EN_US guid', () => {
      const dateTimeFromFunction = getLocalDateTimeForGuid(
        newTabEnUsSurface.guid,
        mockGetScheduledSurfacesForUserQueryData,
      );

      const localDateTime = DateTime.local().setZone(
        newTabEnUsSurface.ianaTimezone,
      );

      expect(dateTimeFromFunction).toEqual(
        localDateTime.toFormat('DDD').concat(', ', localDateTime.toFormat('t')),
      );
    });

    it('should return undefined for an incorrect guid', () => {
      const dateTimeFromFunction = getLocalDateTimeForGuid(
        'FAKE_GUID',
        mockGetScheduledSurfacesForUserQueryData,
      );

      expect(dateTimeFromFunction).toEqual(undefined);
    });
  });

  describe('readImageFileFromDisk function', () => {
    const mockReadAsDataUrl = jest.fn();

    const testFileReader = new FileReader();
    testFileReader.readAsDataURL = mockReadAsDataUrl;

    const testFile = new File([''], 'filename', { type: 'text/html' });

    it('does the test', () => {
      readImageFileFromDisk(testFile, undefined, testFileReader);

      expect(mockReadAsDataUrl).toHaveBeenCalledTimes(1);
    });
  });

  describe('downloadAndUploadApprovedItemImageToS3 function', () => {
    const testMutationResponseData = {
      data: { uploadApprovedCorpusItemImage: { url: 's3-test-image-url' } },
    };

    const testMutationResponseError = {
      errors: [new Error()],
    };

    const originalFetch = global.fetch;
    const mockBlob = new Blob(['test'], { type: 'image/png' });
    const mockResponse = new Response();

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('should return the correct s3 url when the fetch and mutation function is called successfully', async () => {
      global.fetch = jest.fn(() => {
        return Promise.resolve({
          ...mockResponse,
          blob: () => {
            return Promise.resolve(mockBlob);
          },
        });
      });

      // call our function and pass in an anonymous function that returns success mutation response
      const result = await downloadAndUploadApprovedItemImageToS3(
        'www.test-image-url.com',
        () => {
          return testMutationResponseData;
        },
      );

      expect(result).toEqual(
        testMutationResponseData.data.uploadApprovedCorpusItemImage.url,
      );
    });

    it('should throw an error if the image fetch from the source is not successful ', async () => {
      global.fetch = jest.fn(() => {
        return Promise.resolve({
          ...mockResponse,
          ok: false,
        });
      });

      // the anonymous mutation function we pass in as the second argument doesn't matter since the fetch call before it should fail
      await expect(async () => {
        await downloadAndUploadApprovedItemImageToS3(
          'www.test-image-url.com',
          () => {
            return testMutationResponseData;
          },
        );
      }).rejects.toThrow(
        'Failed to download image, please upload a new image manually',
      );
    });

    it('should throw an error if the mutation function is unsuccessful ', async () => {
      global.fetch = jest.fn(() => {
        return Promise.resolve({
          ...mockResponse,
          blob: () => {
            return Promise.resolve(mockBlob);
          },
        });
      });

      // the anonymous mutation function returns an error response
      await expect(async () => {
        await downloadAndUploadApprovedItemImageToS3(
          'www.test-image-url.com',
          () => {
            return testMutationResponseError;
          },
        );
      }).rejects.toThrow('Failed to upload image, please try again');
    });
  });

  describe('getFormattedImageUrl function', () => {
    it('should return the url with pocket image cache prefix', () => {
      const testUrl = 'www.test-image.com';
      const formattedUrl = `https://pocket-image-cache.com/600x300/filters:format(jpg):extract_focal()/${testUrl}`;

      expect(getFormattedImageUrl(testUrl)).toEqual(formattedUrl);
    });

    it('should return fallback url when an empty string is passed', () => {
      expect(getFormattedImageUrl('')).toEqual(
        '/placeholders/collectionSmall.svg',
      );
    });
  });

  describe('formatFormLabel function', () => {
    it('should return the correctly formatted string', () => {
      expect(formatFormLabel('floRAL_street')).toEqual('Floral street');
      expect(formatFormLabel('Article_Quality')).toEqual('Article quality');
      expect(formatFormLabel('MatheMatics')).toEqual('Mathematics');
    });
  });

  describe('getLastScheduledDayDiff function', () => {
    const currentScheduleDate = '2024-01-20';

    it('should return null if the item has no schedule history', () => {
      const scheduledDates: string[] = [];

      expect(
        getLastScheduledDayDiff(currentScheduleDate, scheduledDates),
      ).toBeNull();
    });

    it('should return null if the item has less than 2 schedule history entries', () => {
      const scheduledDates: string[] = ['2024-01-25'];

      expect(
        getLastScheduledDayDiff(currentScheduleDate, scheduledDates),
      ).toBeNull();
    });

    it('should return null if no scheduled date is found before the given date', () => {
      const scheduledDates: string[] = [
        '2024-01-21',
        '2024-02-20',
        '2025-03-15',
      ];

      // current scheduled date is Jan 20, 2024. scheduled dates array has no dates before that
      expect(
        getLastScheduledDayDiff(currentScheduleDate, scheduledDates),
      ).toBeNull();
    });

    it('should return the correct day difference for the most recent scheduled date before current schedule date', () => {
      const scheduledDates: string[] = [
        '2024-02-20',
        '2024-03-20',
        '2022-03-15',
      ];

      const result = getLastScheduledDayDiff(
        currentScheduleDate,
        scheduledDates,
      );

      // current scheduled date is Jan 20, 2024. scheduled dates array has Mar 15, 2022
      const expected = Math.abs(
        Math.ceil(
          (new Date(currentScheduleDate).getTime() -
            new Date(scheduledDates[2]).getTime()) /
            (1000 * 3600 * 24),
        ),
      );
      expect(result).toBe(expected);
    });
  });

  describe('applyExcerptFormattingByLanguage function', () => {
    it('should default to EN_US formatting for excerpt if language is not EN or DE', () => {
      expect(
        applyExcerptFormattingByLanguage(
          CorpusLanguage.It,
          'italian - "excerpt\'s"',
        ),
      ).toEqual('italian - “excerpt’s”');
    });
    it('should use EN_US formatting for excerpt if language is EN', () => {
      expect(
        applyExcerptFormattingByLanguage(
          CorpusLanguage.En,
          'example excerpt in English Language "sample\'s"',
        ),
      ).toEqual('example excerpt in English Language “sample’s”');
    });
    it('should use DE_DE formatting for title excerpt if language is DE', () => {
      expect(
        applyExcerptFormattingByLanguage(
          CorpusLanguage.De,
          '«Meeresregionen» – in die pelagischen "Zonen" – verlegt',
        ),
      ).toEqual('„Meeresregionen” — in die pelagischen „Zonen” — verlegt');
    });
  });

  describe('applyTitleFormattingByLanguage function', () => {
    it('should default to EN_US formatting for title if language is not EN or DE', () => {
      expect(
        applyTitleFormattingByLanguage(CorpusLanguage.Es, "spanish-title's"),
      ).toEqual('Spanish-Title’s');
    });
    it('should use EN_US formatting for title if language is EN', () => {
      expect(
        applyTitleFormattingByLanguage(
          CorpusLanguage.En,
          'example Title in english Language "sample"',
        ),
      ).toEqual('Example Title in English Language “Sample”');
    });
    it('should use DE_DE formatting for title if language is DE', () => {
      // title (German language) no capitalization should be applied
      expect(
        applyTitleFormattingByLanguage(
          CorpusLanguage.De,
          '«Meeresregionen» – in die pelagischen Zonen – verlegt',
        ),
      ).toEqual('„Meeresregionen” — in die pelagischen Zonen — verlegt');
    });
  });
});
