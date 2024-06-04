import { DateTime } from 'luxon';
import { FileWithPath } from 'react-dropzone';
import { CorpusLanguage, GetScheduledSurfacesForUserQuery } from '../../api/generatedTypes';
import { ScheduledSurfaces } from './definitions';
import { applyCurlyQuotes } from '../../_shared/utils/applyCurlyQuotes';
import { applyApTitleCase } from '../../_shared/utils/applyApTitleCase';
import { applyQuotesDashesDE } from '../../_shared/utils/applyQuotesDashesDE';

// downloads image from source url
export const fetchFileFromUrl = async (
  url: string,
): Promise<Blob | undefined> => {
  const response = await fetch(url);

  if (response.ok) return response.blob();
};

/**
 *
 * `uploadApprovedItemMutation` parameter type is set to `any`
 * because we can't pull the upload mutation hook outside of the functional component
 * hence we have to pass it in as a parameter
 */
export const downloadAndUploadApprovedItemImageToS3 = async (
  imageUrl: string,
  uploadApprovedItemMutation: any,
): Promise<string> => {
  // bypassing CORS and downloading
  const image = await fetchFileFromUrl(
    'https://pocket-image-cache.com/x/filters:no_upscale():format(jpg)/' +
      encodeURIComponent(imageUrl),
  );

  if (!image) {
    throw new Error(
      'Failed to download image, please upload a new image manually',
    );
  }
  // upload downloaded image to s3
  const { data, errors } = await uploadApprovedItemMutation({
    variables: {
      image: image,
    },
  });

  // check for graphQL errors. Show an user friendly error message
  if (errors) {
    throw new Error('Failed to upload image, please try again');
  }

  return data?.uploadApprovedCorpusItemImage.url;
};

/**
 * This helper function reads a file, creates an HTML image and
 * assigns the onLoadCallBack function to its onLoad property
 * NOTE: the optional argument fileReader is only being used for testing purposes as of now
 */
export const readImageFileFromDisk = (
  file: FileWithPath,
  onloadCallBack?: VoidFunction,
  fileReader?: FileReader,
) => {
  const reader: FileReader = fileReader || new FileReader();

  //read file as a blob
  reader.readAsDataURL(file);

  // Load it
  reader.onloadend = (e) => {
    const contents = e.target?.result;

    // Load the contents of this file to an image element
    const image = new Image() as HTMLImageElement;
    // make sure file is an image
    if (typeof contents === 'string' && contents.includes('image/')) {
      image.src = contents;

      if (onloadCallBack) {
        image.onload = onloadCallBack;
      }
    }
  };
};

export const getLocalDateTimeForGuid = (
  guidCode: string,
  scheduledSurfacesForUser: GetScheduledSurfacesForUserQuery,
) => {
  const guid = scheduledSurfacesForUser.getScheduledSurfacesForUser.find(
    (item) => item.guid === guidCode,
  );

  if (!guid) {
    return;
  }

  const localDateTime = DateTime.local().setZone(guid.ianaTimezone);

  // the Luxon library does not provide us a straightforward way to format the date the way we want
  // i.e August 28, 2022, 11:59 pm. That is why you can see we are concatenating two different formats
  // url for reference https://moment.github.io/luxon/#/formatting?id=table-of-tokens
  return localDateTime
    .toFormat('DDD')
    .concat(', ', localDateTime.toFormat('t'));
};

/**
 * Converts an user's Mozilla ldap username e.g ad|Mozilla-LDAP|jdoe to jdoe
 * @param ldapString
 * @returns Curator's username in the following format: flastname
 */
export const getCuratorNameFromLdap = (ldapString: string): string => {
  return ldapString.split('|')[2] ?? ldapString;
};

/**
 * Converts a scheduled surface guid e.g "NEW_TAB_EN_US" to a readable format
 * @param surfaceGuid
 * @returns Readable scheduled surface name e.g New Tab (en-US)
 */
export const getScheduledSurfaceName = (surfaceGuid: string): string => {
  return (
    ScheduledSurfaces.find((surface) => surface.guid === surfaceGuid)?.name ??
    surfaceGuid
  );
};

/**

 * Pass an original item image url through the pocket-image-cache to extract 600x300 version of it
 * @param imageUrl
 * @returns image url prefixed with 'pocket-image-cache' or default placeholder
 */
export const getFormattedImageUrl = (imageUrl: string): string => {
  if (imageUrl && imageUrl.length > 0) {
    return `https://pocket-image-cache.com/600x300/filters:format(jpg):extract_focal()/`.concat(
      encodeURIComponent(imageUrl),
    );
  }
  return '/placeholders/collectionSmall.svg';
};

/* Formats string for a form label: mathEMa_tics -> Mathematics
 * @param str
 * @returns formatter string (First letter uppercase, the rest lowercase, removes underscore)
 */
export const formatFormLabel = (str: string): string => {
  return (
    str.charAt(0).toUpperCase() +
    str.substring(1).toLowerCase().replace(/_/g, ' ')
  );
};

/**
 * Finds the number of days a scheduled item was scheduled for most recently before
 * the current date the scheduled is being viewed for.
 * E.g when viewing schedule for Jan 25, 2024, it will return "5 days ago" for an item that was scheduled on 25th (current) and on Jan 20, 2024
 * @param currentDateViewingScheduleFor
 * @param listOfScheduleDates
 * @returns
 */
export const getLastScheduledDayDiff = (
  currentDateViewingScheduleFor: string,
  listOfScheduleDates: string[],
): number | null => {
  // find the most recent scheduled date before the current date that the schedule is being viewed for
  const mostRecentScheduleDate = listOfScheduleDates.find(
    (scheduledDate) => scheduledDate < currentDateViewingScheduleFor,
  );

  if (!mostRecentScheduleDate) {
    return null;
  }

  const daysDifference =
    new Date(currentDateViewingScheduleFor).getTime() -
    new Date(mostRecentScheduleDate).getTime();
  return Math.abs(Math.ceil(daysDifference / (1000 * 3600 * 24)));
};

/**
 * Formats a string using rules based on the string language.
 * @param language the language the passed string is in
 * @param str string to format
 * @param isExcerpt indicates if string is an excerpt as different formatting rules are applied for certain languages
 * @returns formatted string
 */
export const applyStrFormatByLanguage = (
  language: CorpusLanguage,
  str: string,
  isExcerpt: boolean
): string => {
  // if not excerpt (title is passed), apply quotes & title case for EN
  if (language === CorpusLanguage.En && !isExcerpt) {
    return applyCurlyQuotes(applyApTitleCase(str));
  }
  // if excerpt, apply quotes formatting for EN
  if(language === CorpusLanguage.En && isExcerpt) {
    applyCurlyQuotes(str)
  }
  //if excerpt or title, apply German quotes/dashes formatting
  if(language === CorpusLanguage.De) {
    return applyQuotesDashesDE(str) as string;
  }
  // apply EN formatting rules for other languages for now
  else {
    if(!isExcerpt) {
      return applyCurlyQuotes(applyApTitleCase(str));
    }
    else {
      return applyCurlyQuotes(str);
    }
  }
}
