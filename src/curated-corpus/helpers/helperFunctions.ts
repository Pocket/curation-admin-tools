import { DateTime } from 'luxon';
import { FileWithPath } from 'react-dropzone';
import {
  CorpusLanguage,
  GetScheduledSurfacesForUserQuery,
  ScheduledSurface,
} from '../../api/generatedTypes';
import { ScheduledSurfaces } from './definitions';
import { applyCurlyQuotes } from '../../_shared/utils/applyCurlyQuotes';
import { applyApTitleCase } from '../../_shared/utils/applyApTitleCase';
import { applyQuotesDashesDE } from '../../_shared/utils/applyQuotesDashesDE';
import {
  CORPUS_IAB_CATEGORIES,
  CorpusIABCategory,
} from '../../api/corpusIABCategories';

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

const DEFAULT_SURFACE_LOCALE = 'en-US';

/**
 * Extracts locale from a scheduled surface GUID by parsing the last two segments.
 * Expected GUID format: "NEW_TAB_EN_US" -> "en-US"
 * Handles INTL regions: "NEW_TAB_DE_INTL" -> "de-INTL"
 *
 * @param guid - The scheduled surface GUID (e.g., "NEW_TAB_EN_US")
 * @returns Locale string in language-region format (e.g., "en-US")
 */
const inferLocaleFromGuid = (guid: string): string => {
  const segments = guid.split('_');
  if (segments.length < 3) {
    return DEFAULT_SURFACE_LOCALE;
  }

  // Extract language and region from the last two segments of the GUID
  const language = segments[segments.length - 2]?.toLowerCase();
  const region = segments[segments.length - 1];

  // Special handling for international regions
  if (region === 'INTL') {
    return `${language}-INTL`;
  }

  // Standard locale format: language-REGION (e.g., "en-US", "de-DE")
  return `${language}-${region}`;
};

/**
 * Determines the locale for a scheduled surface by parsing its GUID.
 * Falls back to parsing the GUID directly if surface isn't found in the list.
 *
 * @param surfaces - Array of available scheduled surfaces
 * @param guid - The scheduled surface GUID to get locale for
 * @returns Full locale string (e.g., "en-US", "de-DE")
 */
export const getLocaleForScheduledSurface = (
  surfaces: ScheduledSurface[],
  guid?: string,
): string => {
  if (!guid) {
    return DEFAULT_SURFACE_LOCALE;
  }

  const matchedSurface = surfaces.find((surface) => surface.guid === guid);

  // Parse locale from the GUID (more reliable than parsing display name)
  return inferLocaleFromGuid(matchedSurface?.guid ?? guid);
};

/**
 * Returns the appropriate date input format for a given locale.
 * Note: This is primarily used for visual reference, as MUI DatePicker
 * with adapterLocale handles formatting automatically.
 *
 * @param locale - Full locale string (e.g., "en-US", "de-DE")
 * @returns Date format string for the locale
 */
export const getDateFormatForLocale = (locale: string): string => {
  switch (locale) {
    case 'en-US':
      return 'MM/dd/yyyy';
    case 'de-DE':
      return 'dd.MM.yyyy';
    default:
      return 'dd/MM/yyyy';
  }
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
 * Formats an excerpt using rules based on the excerpt's language.
 * @param language the language the passed excerpt is in
 * @param excerpt excerpt to format
 * @returns formatted excerpt
 */
export const applyExcerptFormattingByLanguage = (
  language: CorpusLanguage,
  excerpt: string,
): string => {
  // if excerpt is German, apply German quotes/dashes formatting
  if (language === CorpusLanguage.De) {
    return applyQuotesDashesDE(excerpt) as string;
  }
  // apply EN formatting rules on excerpt for all other languages for now
  else {
    return applyCurlyQuotes(excerpt);
  }
};

/**
 * Formats a title using rules based on the title's language.
 * @param language the language the passed title is in
 * @param title title to format
 * @returns formatted title
 */
export const applyTitleFormattingByLanguage = (
  language: CorpusLanguage,
  title: string,
): string => {
  // if title is in German, apply German quotes/dashes formatting
  if (language === CorpusLanguage.De) {
    return applyQuotesDashesDE(title) as string;
  }
  // apply EN formatting rules on title for all other languages for now
  else {
    return applyCurlyQuotes(applyApTitleCase(title));
  }
};

/**
 * Constructs the full IAB label (parent/child hierarchy) based on the provided IAB code
 * @param taxonomy the IAB taxonomy version
 * @param iabCode the iabCode to lookup in taxonomy
 * @returns string IAB category names joined with an arrow (->) to form a readable path
 */
export const getIABCategoryTreeLabel = (
  taxonomy: string,
  iabCode: string,
): string => {
  const iabTaxonomy = CORPUS_IAB_CATEGORIES[taxonomy];
  // Check if taxonomy version/ IAB code exists
  if (!iabTaxonomy || !iabTaxonomy[iabCode]) return '';

  // Array to hold IAB category names from each Tier in the hierarchy, from parent -> child
  const iabLabels: string[] = [];
  let currentIABCategory: CorpusIABCategory | null = iabTaxonomy[iabCode];

  // Start from target IAB category (child) & walk up the parent chain
  while (currentIABCategory) {
    // Add child category to the END of the array
    iabLabels.unshift(currentIABCategory.name);
    // Walk up to the parent IAB category (if there is a parent)
    currentIABCategory = currentIABCategory.parentId
      ? iabTaxonomy[currentIABCategory.parentId]
      : null;
  }

  return iabLabels.join(' → ');
};
