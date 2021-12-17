import {
  ApprovedCuratedCorpusItem,
  CuratedStatus,
} from '../api/curated-corpus-api/generatedTypes';
import { Prospect } from '../api/prospect-api/generatedTypes';
/**
 *
 * This is a helper file that contains some helper functions. Right now
 * it only has one but we could add more to it
 */

/**
 *
 * This function simply transforms a Prospect object type to
 * an Approved Curated Corpus Item type. This is used to
 * convert a prospect item into a "dummy" approved item in the
 * ProspectItemModal
 */
export const transformProspectToApprovedItem = (
  prospect: Prospect,
  isRecommendation: boolean
): ApprovedCuratedCorpusItem => {
  return {
    externalId: '',
    prospectId: prospect.id,
    url: prospect.url,
    title: prospect.title ?? '',
    imageUrl: prospect.imageUrl ?? '',
    publisher: prospect.publisher ?? '',
    language: prospect.language ?? '',
    topic: prospect.topic ?? '',
    status: isRecommendation
      ? CuratedStatus.Recommendation
      : CuratedStatus.Corpus,
    isShortLived: false,
    isSyndicated: prospect.isSyndicated ?? false,
    isCollection: prospect.isCollection ?? false,
    excerpt: prospect.excerpt ?? '',
    createdAt: prospect.createdAt ?? 0,
    createdBy: '',
    updatedAt: 0,
  };
};

// downloads image from source url
export const fetchFileFromUrl = async (
  url: string
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
  uploadApprovedItemMutation: any
): Promise<string> => {
  // bypassing CORS and downloading
  const image = await fetchFileFromUrl(
    'https://pocket-image-cache.com/x/filters:no_upscale():format(jpg)/' +
      encodeURIComponent(imageUrl)
  );
  // upload downloaded image to s3
  const data = await uploadApprovedItemMutation({
    variables: {
      image: image,
    },
  });

  const s3ImageUrl: string =
    data.data?.uploadApprovedCuratedCorpusItemImage.url;
  if (!s3ImageUrl) {
    throw new Error('Could not upload image to s3');
  }

  return s3ImageUrl;
};
