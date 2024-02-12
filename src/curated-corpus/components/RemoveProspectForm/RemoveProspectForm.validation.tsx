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
    otherReason: yup
      .string()
      .max(100, 'Reason is too long, cannot exceed 100 characters.'), // max 50 chars for now
  })
  .test('removalReason', '', (obj) => {
    // If at least one checkbox was selected, let the form validation pass
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
      obj[RemovalReason.TopicDiversity]
    ) {
      return true;
    }

    return new yup.ValidationError(
      'Please choose at least one removal reason.',
      null,
      'removalReason'
    );
  });
