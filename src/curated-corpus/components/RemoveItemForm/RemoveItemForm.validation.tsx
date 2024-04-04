import * as yup from 'yup';
import { RemovalReason } from '../../../api/generatedTypes';

export const validationSchema = yup
  .object({
    [RemovalReason.ArticleQuality]: yup.boolean(),
    [RemovalReason.Commercial]: yup.boolean(),
    [RemovalReason.Controversial]: yup.boolean(),
    [RemovalReason.HedDekQuality]: yup.boolean(),
    [RemovalReason.ImageQuality]: yup.boolean(),
    [RemovalReason.Niche]: yup.boolean(),
    [RemovalReason.NoImage]: yup.boolean(),
    [RemovalReason.OneSided]: yup.boolean(),
    [RemovalReason.Partisan]: yup.boolean(),
    [RemovalReason.Paywall]: yup.boolean(),
    [RemovalReason.PublisherDiversity]: yup.boolean(),
    [RemovalReason.PublisherQuality]: yup.boolean(),
    [RemovalReason.PublishDate]: yup.boolean(),
    [RemovalReason.SetDiversity]: yup.boolean(),
    [RemovalReason.TimeSensitive]: yup.boolean(),
    [RemovalReason.TopicDiversity]: yup.boolean(),
    ['OTHER']: yup.boolean(),
    reasonComment: yup
      .string()
      .max(100, 'Reason is too long, cannot exceed 100 characters.'), // max 100 chars for now
  })
  .test('removalReason', '', (obj) => {
    // If Other checkbox was selected but no reason entered, fail validation
    if (obj['OTHER'] && obj['reasonComment'] === undefined) {
      return new yup.ValidationError(
        'Please provide a comment for removing this item.',
        null,
        'reasonComment'
      );
    }
    // If Other checkbox was NOT selected but a reason was entered, fail validation
    if (!obj['OTHER'] && obj['reasonComment']) {
      return new yup.ValidationError(
        'Please select the "OTHER" reason checkbox.',
        null,
        'removalReason'
      );
    }
    // If at least one checkbox was selected & above conditions satisfied, pass validation
    if (
      obj[RemovalReason.ArticleQuality] ||
      obj[RemovalReason.Commercial] ||
      obj[RemovalReason.Controversial] ||
      obj[RemovalReason.HedDekQuality] ||
      obj[RemovalReason.ImageQuality] ||
      obj[RemovalReason.Niche] ||
      obj[RemovalReason.NoImage] ||
      obj[RemovalReason.OneSided] ||
      obj[RemovalReason.Partisan] ||
      obj[RemovalReason.Paywall] ||
      obj[RemovalReason.PublisherDiversity] ||
      obj[RemovalReason.PublisherQuality] ||
      obj[RemovalReason.PublishDate] ||
      obj[RemovalReason.SetDiversity] ||
      obj[RemovalReason.TimeSensitive] ||
      obj[RemovalReason.TopicDiversity] ||
      (obj['OTHER'] && obj['reasonComment'])
    ) {
      return true;
    }

    return new yup.ValidationError(
      'Please choose at least one removal reason.',
      null,
      'removalReason'
    );
  });
